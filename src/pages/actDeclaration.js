import React, { useReducer, useRef, useState } from "react"
import PropTypes from "prop-types"
import Router, { useRouter } from "next/router"
import fetch from "isomorphic-unfetch"
import { Alert, Col, Container, FormFeedback, FormText, Input, Row } from "reactstrap"
import moment from "moment"
import { handleAPIResponse } from "../utils/errors"
import AskerSelect from "../components/AskerSelect"
import { API_URL, ACTS_ENDPOINT } from "../config"
import { isEmpty, deleteProperty } from "../utils/misc"
import { METHOD_POST, METHOD_PUT } from "../utils/http"
import Layout from "../components/Layout"
import ActBlock from "../components/ActBlock"
import { Title1, Title2, Label, ValidationButton } from "../components/StyledComponents"
import { ACT_MANAGEMENT } from "../utils/roles"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../utils/auth"
import { now, ISO_DATE } from "../utils/date"
import { profiles, orderedProfileValues } from "../utils/actsConstants"
import { logError, logDebug } from "../utils/logger"

// import { useTraceUpdate } from "../utils/debug"

// internalNumber & pvNumber found by query, in update situation
const getInitialState = ({ act, internalNumber, pvNumber, userId, hospitalId }) => {
   if (act && act.id) {
      return { ...act, userId }
   } else {
      return {
         pvNumber: pvNumber || "",
         internalNumber: internalNumber || "",
         examinationDate: moment(now()).format(ISO_DATE),
         askerId: null,
         profile: "",
         addedBy: userId || "",
         hospitalId: hospitalId || "",
      }
   }
}

const resetState = ({
   pvNumber,
   internalNumber,
   examinationDate,
   askerId,
   profile,
   proofWithoutComplaint,
   addedBy,
   hospitalId,
}) => ({
   pvNumber,
   internalNumber,
   examinationDate,
   askerId,
   profile,
   proofWithoutComplaint,
   addedBy,
   hospitalId,
})

const hasErrors = state => {
   let errors = {}

   if (!state.profile) {
      errors = { ...errors, profile: "Obligatoire" }
   }
   if (!state.internalNumber) {
      errors = { ...errors, internalNumber: "Obligatoire" }
   }
   if (!state.examinationDate) {
      errors = { ...errors, examinationDate: "Obligatoire" }
   } else {
      const date = moment(state.examinationDate)
      if (!date.isValid()) {
         errors = { ...errors, examinationDate: "Format incorrect" }
      } else {
         if (date > now()) {
            errors = { ...errors, examinationDate: "La date doit être passée" }
         }
      }
   }

   if (!state.askerId && !state.proofWithoutComplaint) {
      errors = { ...errors, askerId: "Demandeur manquant ou invalide" }
   }

   return errors
}

const reduceByMode = (state, action) => {
   const newState = { ...state }

   switch (action.payload.mode) {
      case "toggle":
         if (state[action.type] === action.payload.val) {
            newState[action.type] = ""
         } else {
            newState[action.type] = action.payload.val
         }
         return newState
      case "toggleMultiple": {
         let newStateType = state[action.type] || []
         const index = newStateType.indexOf(action.payload.val)
         if (index !== -1) {
            newState[action.type] = [...newStateType.slice(0, index), ...newStateType.slice(index + 1)]
         } else {
            const chunks = action.payload.val.split("/")

            let prefix = ""
            if (chunks.length >= 2) {
               prefix = chunks[0]
               newStateType = newStateType.filter(e => !e.startsWith(prefix))
            }

            newState[action.type] = [...newStateType, action.payload.val]
         }
         return newState
      }
      case "lock":
         newState[action.type] = newState[action.type] || action.payload.val
         return newState
      default:
         // regular replace
         newState[action.type] = action.payload.val
         return newState
   }
}

const ActDeclaration = ({ act, currentUser }) => {
   const router = useRouter()
   const { internalNumber, pvNumber } = router.query
   const refPersonType = useRef()
   const [errors, setErrors] = useState({})
   const [warnings, setWarnings] = useState({})

   const { id: userId, hospital } = currentUser

   const hospitalId = (hospital && hospital.id) || null

   const reducer = (state, action) => {
      logDebug("reducer", state, action)

      setErrors(deleteProperty(errors, action.type))

      switch (action.type) {
         case "examinationDate": {
            const newState = reduceByMode(state, action)
            return reduceByMode(newState, { type: "periodOfDay", payload: { val: "" } })
         }
         case "proofWithoutComplaint": {
            let newState = reduceByMode(state, action)
            setErrors(deleteProperty(errors, "askerId"))
            newState = reduceByMode(newState, { type: "askerId", payload: { val: null } })
            newState = reduceByMode(newState, { type: "pvNumber", payload: { val: "" } })
            return newState
         }
         case "profile": {
            let newState = reduceByMode(state, action)

            if (action.payload.mode !== "lock") {
               newState = resetState(newState)
            }

            const errors = hasErrors(newState, setErrors)

            if (!isEmpty(errors)) {
               setErrors(errors)
               logError(errors)
            } else {
               setErrors({})
               refPersonType.current.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
               })
            }

            return newState
         }
         default:
            return reduceByMode(state, action)
      }
   }

   const [state, dispatch] = useReducer(
      reducer,
      getInitialState({
         act,
         internalNumber,
         pvNumber,
         userId,
         hospitalId,
      }),
   )

   const getProfiledRender = ({ profile }) => {
      return profiles[profile].edit({ dispatch, state, errors })
   }

   const validAndSubmitAct = async () => {
      setErrors({})

      let errors = hasErrors(state)

      if (state.profile) {
         errors = { ...errors, ...profiles[state.profile].hasErrors(state) }
      }

      if (!isEmpty(errors)) {
         logError(`State non valide`, state)
         logError(errors)
         setErrors(errors)
         return
      }

      let json

      if (!state.id) {
         try {
            const response = await fetch(API_URL + ACTS_ENDPOINT, {
               method: METHOD_POST,
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(state),
            })
            json = await handleAPIResponse(response)

            return Router.push({
               pathname: "/actConfirmation",
               query: {
                  internalNumber: state.internalNumber,
                  pvNumber: state.pvNumber,
               },
            })
         } catch (error) {
            logError(error)
            setErrors(errors => ({
               ...errors,
               general: json && json.message ? json.message : "Erreur serveur",
            }))
         }
      } else {
         try {
            const response = await fetch(API_URL + ACTS_ENDPOINT + "/" + state.id, {
               method: METHOD_PUT,
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(state),
            })
            json = await handleAPIResponse(response)

            return Router.push({
               pathname: "/actConfirmation",
               query: {
                  internalNumber: state.internalNumber,
                  pvNumber: state.pvNumber,
                  edit: true,
               },
            })
         } catch (error) {
            logError(error)
            setErrors(errors => ({
               ...errors,
               general: json && json.message ? json.message : "Erreur serveur",
            }))
         }
      }
   }

   const shouldDisplayProfile = () => {
      //TODO: vérifier que les conditions sont toujours bonnes
      // creation case
      if (state.profile && !errors.internalNumber && !errors.examinationDate) return true
      // update case
      if (state.id) return true
      return false
   }

   const onBlurNumberInputs = async event => {
      const { id } = event.target

      const urlChunk = `?${id}=${state[id]}`

      if (state[id]) {
         try {
            const response = await fetch(`${API_URL}${ACTS_ENDPOINT}${urlChunk}`)
            const acts = await handleAPIResponse(response)

            if (acts && acts.length) {
               setWarnings({ ...warnings, [id]: "Déjà utilisé" })
            } else {
               setWarnings({ ...warnings, [id]: null })
            }
         } catch (error) {
            logError("Erreur d'API pour recherche d'internal number")
            setWarnings({})
         }
      }
   }

   if (!hospitalId)
      return (
         <Layout page="actDeclaration" currentUser={currentUser}>
            <Title1 className="mt-5 mb-5">{!state.id ? "Ajout d'acte" : "Modification d'un acte"}</Title1>
            <Container style={{ maxWidth: 720 }}>
               <Alert color="danger">
                  {"Cette fonctionnalité n'est disponible que si vous avez un établissement d'appartenance."}
               </Alert>
            </Container>
         </Layout>
      )

   return (
      <Layout page="actDeclaration" currentUser={currentUser}>
         <Title1 className="mt-5 mb-5">{!state.id ? "Ajout d'acte" : "Modification d'un acte"}</Title1>
         <Container style={{ maxWidth: 720 }}>
            <Title2 className="mb-4">{"Données d'identification de l'acte"}</Title2>

            <Row>
               <Col sm="6" md="4">
                  <Label htmlFor="internalNumber">Numéro interne</Label>
                  <Input
                     id="internalNumber"
                     invalid={errors && !!errors.internalNumber}
                     placeholder="Ex: 2019-23091"
                     value={state.internalNumber}
                     onChange={e => dispatch({ type: e.target.id, payload: { val: e.target.value } })}
                     autoComplete="off"
                     onBlur={onBlurNumberInputs}
                  />
                  {warnings && warnings.internalNumber && <FormText color="warning">Ce numéro existe déjà</FormText>}
                  <FormFeedback>{errors && errors.internalNumber}</FormFeedback>
               </Col>
               <Col sm="6" md="4">
                  <Label htmlFor="examinationDate">{"Date d'examen"}</Label>
                  <Input
                     id="examinationDate"
                     invalid={errors && !!errors.examinationDate}
                     type="date"
                     value={state.examinationDate || moment(now()).format(ISO_DATE)}
                     // value={state.examinationDate}
                     onChange={e => dispatch({ type: e.target.id, payload: { val: e.target.value } })}
                  />
                  <FormFeedback>{errors && errors.examinationDate}</FormFeedback>
               </Col>
               <Col className="mt-4 text-center mt-md-0" sm="12" md="4">
                  <Label htmlFor="proofWithoutComplaint">Recueil de preuve sans plainte</Label>
                  <br />
                  <Input
                     type="checkbox"
                     name="proofWithoutComplaint"
                     id="proofWithoutComplaint"
                     value={state.proofWithoutComplaint || false}
                     checked={state.proofWithoutComplaint || false}
                     style={{ margin: "auto" }}
                     onChange={e => dispatch({ type: e.target.id, payload: { val: e.target.checked } })}
                  ></Input>
               </Col>
            </Row>
            <Row>
               <Col md="4" className="mt-4 mt-md-0">
                  <Label htmlFor="pvNumber">Numéro de PV</Label>
                  <Input
                     id="pvNumber"
                     placeholder={state.proofWithoutComplaint ? "" : "Recommandé"}
                     value={state.pvNumber}
                     disabled={!!state.proofWithoutComplaint}
                     onChange={e => dispatch({ type: e.target.id, payload: { val: e.target.value } })}
                     autoComplete="off"
                     onBlur={onBlurNumberInputs}
                  />
                  {warnings && warnings.pvNumber && <FormText color="warning">Ce numéro existe déjà</FormText>}
               </Col>
               <Col md="8" className="mt-4 mt-md-0">
                  <Label htmlFor="askerId">Demandeur</Label>
                  <AskerSelect
                     dispatch={dispatch}
                     id="askerId"
                     askerId={state.askerId}
                     disabled={!!state.proofWithoutComplaint}
                     error={errors && errors.askerId ? errors.askerId : null}
                  />
                  <div style={{ color: "#d63626", fontSize: "80%" }}>{errors && errors.askerId}</div>
               </Col>
            </Row>

            <Title2 className="mt-5 mb-4" ref={refPersonType}>
               Qui a été examiné?
            </Title2>

            {state.proofWithoutComplaint ? (
               <ActBlock
                  type="profile"
                  values={["Victime (vivante)"]}
                  mode="toggle"
                  dispatch={dispatch}
                  state={state.profile}
               />
            ) : !state.id ? (
               <ActBlock
                  type="profile"
                  values={orderedProfileValues}
                  mode="toggle"
                  dispatch={dispatch}
                  state={state.profile}
               />
            ) : (
               <ActBlock
                  type="profile"
                  values={[state.profile]}
                  mode="lock"
                  dispatch={dispatch}
                  state={state.profile}
               />
            )}

            {shouldDisplayProfile() && getProfiledRender(state)}

            {!isEmpty(errors) && (
               <Alert color="danger">
                  {errors.general
                     ? errors.general
                     : "Il y a des erreurs dans le formulaire. Veuillez remplir les éléments affichés en rouge."}
               </Alert>
            )}

            <div className="mt-5 text-center">
               <ValidationButton color="primary" size="lg" className="center" onClick={validAndSubmitAct}>
                  {state.id ? "Modifier" : "Valider"}
               </ValidationButton>
            </div>
         </Container>
      </Layout>
   )
}

ActDeclaration.propTypes = {
   act: PropTypes.object,
   error: PropTypes.string,
   currentUser: PropTypes.object.isRequired,
}

const transformDBActForState = act => {
   const newAct = {
      ...act,
      askerId: act.asker && act.asker.id ? act.asker.id : null,
      hospitalId: act.hospital && act.hospital.id ? act.hospital.id : "",
   }

   delete newAct.asker
   delete newAct.hospital
   delete newAct.user
   return newAct
}

ActDeclaration.getInitialProps = async ctx => {
   const authHeaders = buildAuthHeaders(ctx)

   const { query } = ctx

   try {
      if (!query || !query.id) return { act: {} }

      const response = await fetch(API_URL + ACTS_ENDPOINT + "/" + query.id, { headers: authHeaders })
      const act = await handleAPIResponse(response)

      return { act: transformDBActForState(act) || {} }
   } catch (error) {
      logError(error)

      redirectIfUnauthorized(error, ctx)
   }
}

export default withAuthentication(ActDeclaration, ACT_MANAGEMENT)
