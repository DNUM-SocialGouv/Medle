import React, { useReducer, useRef, useState } from "react"
import PropTypes from "prop-types"
import Router, { useRouter } from "next/router"
import nextCookie from "next-cookies"
import fetch from "isomorphic-unfetch"
import { handleAPIResponse } from "../utils/errors"
import { Col, Container, FormFeedback, Input, Row } from "reactstrap"
import moment from "moment"
import AskerAutocomplete from "../components/AskerAutocomplete"
import { API_URL, ACT_DECLARATION_ENDPOINT, ACT_DETAIL_ENDPOINT, ACT_EDIT_ENDPOINT } from "../config"
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

const getInitialState = ({ act, internalNumber, pvNumber, userId, hospitalId }) => {
   if (act && act.id) {
      return { ...act, userId }
   } else {
      return {
         pvNumber: pvNumber || "",
         internalNumber: internalNumber || "",
         examinationDate: "",
         askerId: "",
         profile: "",
         addedBy: userId || "",
         hospitalId: hospitalId || "",
      }
   }
}

const resetState = ({ pvNumber, internalNumber, examinationDate, askerId, profile, addedBy, hospitalId }) => ({
   pvNumber,
   internalNumber,
   examinationDate,
   askerId,
   profile,
   addedBy,
   hospitalId,
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
         if (date > moment()) {
            errors = { ...errors, examinationDate: "La date doit être passée" }
         }
      }
   }

   if (!state.askerId) {
      errors = { ...errors, asker: "Obligatoire" }
   }

   return errors
}

const ActDeclaration = ({ act, userId, hospitalId }) => {
   const router = useRouter()
   const { internalNumber, pvNumber } = router.query
   const refPersonType = useRef()
   const [errors, setErrors] = useState({})

   const reducer = (state, action) => {
      console.log("action 1", action)
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
         case "askerId":
            return { ...state, askerId: action.payload }
         case "profile": {
            setErrors({})
            if (action.payload.mode !== "lock") {
               state = resetState(state)
            }

            const errors = hasErrors(state, setErrors)

            toast.error("Oups! Des informations importantes sont manquantes...")

            if (!isEmpty(errors)) {
               setErrors(precedentState => ({
                  ...precedentState,
                  ...errors,
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
         act,
         internalNumber,
         pvNumber,
         userId,
         hospitalId,
      }),
   )

   const PROFILES = {
      Victime: {
         render: <VictimProfile dispatch={dispatch} state={state} errors={errors} />,
         hasErrors: VictimProfile.hasErrors,
      },
      "Gardé.e à vue": {
         render: <CustodyProfile dispatch={dispatch} state={state} errors={errors} />,
         hasErrors: CustodyProfile.hasErrors,
      },
      "Personne décédée": {
         render: <DeceasedProfile dispatch={dispatch} state={state} errors={errors} />,
         hasErrors: DeceasedProfile.hasErrors,
      },
      "Personne pour âge osseux": {
         render: <BoneAgeProfile dispatch={dispatch} state={state} errors={errors} />,
         hasErrors: BoneAgeProfile.hasErrors,
      },
      "Demandeuse d'asile (risque excision)": {
         render: <AsylumSeekerProfile dispatch={dispatch} state={state} errors={errors} />,
         hasErrors: AsylumSeekerProfile.hasErrors,
      },
      "Autre activité/Assises": {
         render: <CriminalCourtProfile dispatch={dispatch} state={state} errors={errors} />,
         hasErrors: CriminalCourtProfile.hasErrors,
      },
      "Autre activité/Reconstitution": {
         render: <ReconstitutionProfile dispatch={dispatch} state={state} errors={errors} />,
         hasErrors: ReconstitutionProfile.hasErrors,
      },
      "Autre activité/IPM": {
         render: <DrunkProfile dispatch={dispatch} state={state} errors={errors} />,
         hasErrors: DrunkProfile.hasErrors,
      },
      "Autre activité/Personne retenue": {
         render: <RestrainedProfile dispatch={dispatch} state={state} errors={errors} />,
         hasErrors: RestrainedProfile.hasErrors,
      },
   }

   const getProfiledRender = ({ profile }) => {
      return PROFILES[profile].render
   }

   const validAndSubmitAct = async () => {
      setErrors({})

      let errors = hasErrors(state, setErrors)

      toast.error("Oups! Des informations importantes sont manquantes...")

      if (!isEmpty(errors)) {
         console.error("Erreur state non valide", state)
         setErrors(precedentState => ({
            ...precedentState,
            ...errors,
         }))
         return
      }

      errors = PROFILES[state.profile].hasErrors(state)

      if (!isEmpty(errors)) {
         console.error(`Erreur state non valide pour profil ${state.profile}`, state)
         setErrors(errors)
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
                     askerId={state.askerId}
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

   let act

   if (id) {
      console.log("id trouvé", id)
      try {
         const response = await fetch(API_URL + ACT_DETAIL_ENDPOINT + "/" + id)
         act = await handleAPIResponse(response)
      } catch (error) {
         console.error(error)
      }
   }

   return { act: act || {}, userId, hospitalId }
}

export default ActDeclaration
