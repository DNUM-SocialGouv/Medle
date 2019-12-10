import React, { useReducer, useRef, useState } from "react"
import PropTypes from "prop-types"
import Router, { useRouter } from "next/router"
import nextCookie from "next-cookies"
import fetch from "isomorphic-unfetch"
import { handleAPIResponse } from "../utils/errors"
import { Col, Container, FormFeedback, FormGroup, Input, Row } from "reactstrap"
import moment from "moment"
import AskerAutocomplete from "../components/AskerAutocomplete"
import {
   API_URL,
   ACT_DECLARATION_ENDPOINT,
   ACT_DETAIL_ENDPOINT,
   ACT_EDIT_ENDPOINT,
   ASKERS_SEARCH_ENDPOINT,
} from "../config"
import { isEmpty, deleteProperty } from "../utils/misc"
import Layout from "../components/Layout"
import ActBlock from "../components/ActBlock"
import {
   VictimProfile,
   CustodyProfile,
   DeceasedProfile,
   BoneAgeProfile,
   AsylumSeekerProfile,
   CriminalCourtProfile,
   ReconstitutionProfile,
   DrunkProfile,
   RestrainedProfile,
} from "../components/profiles"
import { Title1, Title2, Label, ValidationButton } from "../components/StyledComponents"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const getInitialState = ({ asker, internalNumber, pvNumber, act, userId, hospitalId }) => {
   if (act && act.id) {
      return act
   } else {
      return {
         pvNumber: pvNumber || "",
         internalNumber: internalNumber || "",
         examinationDate: "",
         asker: asker || "",
         profile: "",
         addedBy: userId || "",
         hospitalId: hospitalId || "",
      }
   }
}

const resetState = state => ({
   pvNumber: state.pvNumber,
   internalNumber: state.internalNumber,
   examinationDate: state.examinationDate,
   asker: state.asker,
   profile: state.profile,
   addedBy: state.addedBy,
   hospitalId: state.hospitalId,
})

const profileValues = [
   "Victime",
   "Gardé.e à vue",
   "Personne décédée",
   "Personne pour âge osseux",
   "Demandeuse d'asile (risque excision)",
   {
      title: "Autre activité",
      subValues: ["Assises", "Reconstitution", "IPM", "Examen lié à la route", "Personne retenue"],
   },
]

const preValidate = state => {
   let errors = {}
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
         if (date > moment()) {
            errors = { ...errors, examinationDate: "La date doit être passée" }
         }
      }
   }

   return errors
}

const validateAsker = async state => {
   let errors = {}
   if (!state.asker) {
      errors = { asker: "Obligatoire" }
   } else {
      const res = await fetch(`${API_URL}${ASKERS_SEARCH_ENDPOINT}?fuzzy=${state.asker}`)
      const json = await res.json()

      if (!json || json.length !== 1 || json[0].name !== state.asker) {
         errors = { asker: "Demandeur inconnu" }
      }
   }

   return errors
}

const ActDeclaration = ({ act, userId, hospitalId }) => {
   const router = useRouter()
   const { internalNumber, pvNumber } = router.query
   const refPersonType = useRef()
   const [errors, setErrors] = useState({})

   const reducer = (state, action) => {
      setErrors(deleteProperty(errors, action.type))

      if (action.payload.mode === "toggle") {
         if (state[action.type] === action.payload.val) {
            state = { ...state, [action.type]: "" }
         } else {
            state = { ...state, [action.type]: action.payload.val }
         }
      } else if (action.payload.mode === "toggleMultiple") {
         let newState = state[action.type] || []
         const index = newState.indexOf(action.payload.val)
         if (index !== -1) {
            state = { ...state, [action.type]: [...newState.slice(0, index), ...newState.slice(index + 1)] }
         } else {
            const chunks = action.payload.val.split("/")

            let prefix = ""
            if (chunks.length >= 2) {
               prefix = chunks[0]
               newState = newState.filter(e => !e.startsWith(prefix))
            }

            state = {
               ...state,
               [action.type]: [...newState, action.payload.val],
            }
         }
      } else if (action.payload.mode === "replace") {
         state = { ...state, [action.type]: action.payload.val }
      }

      switch (action.type) {
         case "internalNumber":
            setErrors(deleteProperty(errors, "internalNumber"))
            return { ...state, internalNumber: action.payload }
         case "pvNumber":
            return { ...state, pvNumber: action.payload }
         case "examinationDate":
            setErrors(deleteProperty(errors, "examinationDate"))
            state.periodOfDay = ""
            return { ...state, examinationDate: action.payload }
         case "asker":
            return { ...state, asker: action.payload }
         case "profile": {
            setErrors({})
            if (action.payload.mode !== "lock") {
               state = resetState(state)
            }

            const newErrors = preValidate(state)

            if (!isEmpty(newErrors)) {
               setErrors(precedentState => ({
                  ...precedentState,
                  ...newErrors,
               }))

               refPersonType.current.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
               })
            }
            return state
         }
         default:
            return state
      }
   }

   const [state, dispatch] = useReducer(
      reducer,
      getInitialState({
         internalNumber,
         pvNumber,
         act,
         userId,
         hospitalId,
      }),
   )

   const PROFILES = {
      Victime: {
         render: <VictimProfile dispatch={dispatch} state={state} errors={errors} />,
         validate: VictimProfile.validate,
      },
      "Gardé.e à vue": {
         render: <CustodyProfile dispatch={dispatch} state={state} errors={errors} />,
         validate: CustodyProfile.validate,
      },
      "Personne décédée": {
         render: <DeceasedProfile dispatch={dispatch} state={state} errors={errors} />,
         validate: DeceasedProfile.validate,
      },
      "Personne pour âge osseux": {
         render: <BoneAgeProfile dispatch={dispatch} state={state} errors={errors} />,
         validate: BoneAgeProfile.validate,
      },
      "Demandeuse d'asile (risque excision)": {
         render: <AsylumSeekerProfile dispatch={dispatch} state={state} errors={errors} />,
         validate: AsylumSeekerProfile.validate,
      },
      "Autre activité/Assises": {
         render: <CriminalCourtProfile dispatch={dispatch} state={state} errors={errors} />,
         validate: CriminalCourtProfile.validate,
      },
      "Autre activité/Reconstitution": {
         render: <ReconstitutionProfile dispatch={dispatch} state={state} errors={errors} />,
         validate: ReconstitutionProfile.validate,
      },
      "Autre activité/IPM": {
         render: <DrunkProfile dispatch={dispatch} state={state} errors={errors} />,
         validate: DrunkProfile.validate,
      },
      "Autre activité/Personne retenue": {
         render: <RestrainedProfile dispatch={dispatch} state={state} errors={errors} />,
         validate: RestrainedProfile.validate,
      },
   }

   const getProfiledRender = ({ profile }) => {
      return PROFILES[profile].render
   }

   const validAndSubmitAct = async () => {
      setErrors({})

      if (!state.profile) {
         console.error("Pas de profil choisi !!!")
         toast.error("Pas si vite! Il me manque une information importante. Qui a été examiné ?")
         return
      }

      const askerErrors = await validateAsker(state)

      const newErrors = { ...preValidate(state), ...askerErrors, ...PROFILES[state.profile].validate(state) }

      if (Object.keys(newErrors).length) {
         console.error("Erreur state non valide", state)
         setErrors(newErrors)
         console.error("State invalide")
         toast.error("Oups... Certaines informations importantes sont manquantes")
         return
      }

      console.log("pas d'erreurs trouvées")

      let json

      if (!state.id) {
         try {
            const response = await fetch(API_URL + ACT_DECLARATION_ENDPOINT, {
               method: "POST",
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
            console.error(error)
            setErrors(errors => ({
               ...errors,
               general: json && json.message ? json.message : "Erreur en base de données",
            }))
         }
      } else {
         try {
            const response = await fetch(API_URL + ACT_EDIT_ENDPOINT + "/" + state.id, {
               method: "POST",
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
            console.error(error)
            setErrors(errors => ({
               ...errors,
               general: json && json.message ? json.message : "Erreur en base de données",
            }))
         }
      }
   }

   const shouldDisplayProfile = () => {
      // creation case
      if (state.profile && !errors.internalNumber && !errors.examinationDate) return true
      // update case
      if (state.id) return true
      return false
   }

   return (
      <Layout>
         <Title1 className="mt-5 mb-5">{!state.id ? "Ajout d'acte" : "Modification d'un acte"}</Title1>
         <Container style={{ maxWidth: 720 }}>
            <Title2 className="mb-4">{"Données d'identification de l'acte"}</Title2>

            <Row>
               <Col>
                  <Label htmlFor="internalNumber">Numéro interne</Label>
                  <Input
                     id="internalNumber"
                     invalid={errors && !!errors.internalNumber}
                     placeholder="Ex: 2019-23091"
                     value={state.internalNumber}
                     onChange={e => {
                        dispatch({ type: e.target.id, payload: e.target.value })
                     }}
                  />
                  <FormFeedback>{errors && errors.internalNumber}</FormFeedback>
               </Col>
               <Col>
                  <Label htmlFor="examinationDate">{"Date d'examen"}</Label>
                  <Input
                     id="examinationDate"
                     invalid={errors && !!errors.examinationDate}
                     type="date"
                     value={state.examinationDate}
                     onChange={e => dispatch({ type: e.target.id, payload: e.target.value })}
                  />
                  <FormFeedback>{errors && errors.examinationDate}</FormFeedback>
               </Col>
               <Col>
                  <Label htmlFor="proofWithoutComplaint">Recueil de preuve sans plainte</Label>
                  <br />
                  <Input
                     type="checkbox"
                     name="proofWithoutComplaint"
                     id="proofWithoutComplaint"
                     style={{ margin: "auto" }}
                  ></Input>
               </Col>
            </Row>
            <Row>
               <Col md="4">
                  <Label htmlFor="pvNumber">Numéro de PV</Label>
                  <Input
                     id="pvNumber"
                     placeholder="Optionnel"
                     value={state.pvNumber}
                     onChange={e => dispatch({ type: e.target.id, payload: e.target.value })}
                  />
               </Col>
               <Col md="8">
                  <Label htmlFor="asker">Demandeur</Label>
                  <AskerAutocomplete
                     dispatch={dispatch}
                     id="asker"
                     error={errors && errors.asker ? errors.asker : null}
                  />
               </Col>
            </Row>

            <Title2 className="mb-4 mt-5" ref={refPersonType}>
               Qui a été examiné?
            </Title2>

            {!state.id && (
               <ActBlock
                  type="profile"
                  values={profileValues}
                  mode="toggle"
                  dispatch={dispatch}
                  state={state.profile}
               />
            )}

            {state.id && (
               <ActBlock
                  type="profile"
                  values={[state.profile]}
                  mode="lock"
                  dispatch={dispatch}
                  state={state.profile}
               />
            )}

            {shouldDisplayProfile() && getProfiledRender(state)}

            <ToastContainer />

            <div className="text-center mt-5">
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
   userId: PropTypes.string.isRequired,
   hospitalId: PropTypes.string.isRequired,
}

ActDeclaration.getInitialProps = async ctx => {
   const {
      query: { id },
   } = ctx
   const { userId, hospitalId } = nextCookie(ctx)

   let json

   if (id) {
      console.log("id trouvé", id)
      try {
         const response = await fetch(API_URL + ACT_DETAIL_ENDPOINT + "/" + id)
         json = await handleAPIResponse(response)
      } catch (error) {
         console.error(error)
      }
   }

   return { act: json || {}, userId, hospitalId }
}

export default ActDeclaration
