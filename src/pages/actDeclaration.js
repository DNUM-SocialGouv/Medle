import React, { useReducer, useRef, useState, useEffect } from "react"
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

const ActDeclaration = ({ act, userId, hospitalId }) => {
   console.log("ActDeclaration:render")
   const router = useRouter()
   const { internalNumber, pvNumber } = router.query
   const refPersonType = useRef()
   const [errors, setErrors] = useState({})

   // const onFocusRef = useRef(false)

   // console.log("ActDeclaration:onFocusRef", onFocusRef.current)

   // useEffect(() => {
   //    console.log("ActDeclaration:useEffect")
   //    if (onFocusRef.current) {
   //       refPersonType.current.scrollIntoView({
   //          behavior: "smooth",
   //          block: "start",
   //       })
   //       onFocusRef.current = false
   //    }
   // }, [])

   const reducer = (state, action) => {
      console.log("ActDeclaration:reducer", action)

      setErrors(deleteProperty(errors, action.type))

      switch (action.type) {
         case "examinationDate": {
            const newState = reduceByMode(state, action)
            return reduceByMode(newState, { type: "periodOfDay", payload: { val: "" } })
         }
         case "profile": {
            let newState = reduceByMode(state, action)

            console.log("newState", newState)
            if (action.payload.mode !== "lock") {
               newState = resetState(newState)
            }

            const errors = hasErrors(newState, setErrors)

            console.log("errors", errors)

            if (!isEmpty(errors)) {
               setErrors(errors)
               toast.error("Oups! Des informations importantes sont manquantes...")
               console.error("erreur dans profile")
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

      const errors = {
         ...hasErrors(state, setErrors),
         ...PROFILES[state.profile].hasErrors(state),
      }

      if (!isEmpty(errors)) {
         console.error(`Erreur state non valide`, state)
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
                     onChange={e => dispatch({ type: e.target.id, payload: { val: e.target.value } })}
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
                     onChange={e => dispatch({ type: e.target.id, payload: { val: e.target.value } })}
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
                     onChange={e => dispatch({ type: e.target.id, payload: { val: e.target.value } })}
                  />
               </Col>
               <Col md="8">
                  <Label htmlFor="askerId">Demandeur</Label>
                  <AskerAutocomplete
                     dispatch={dispatch}
                     id="askerId"
                     askerId={state.askerId}
                     error={errors && errors.askerId ? errors.askerId : null}
                  />
                  <div style={{ color: "#d63626", fontSize: "80%" }}>{errors && errors.askerId}</div>
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

const transformDBActForState = act => {
   const newAct = {
      ...act,
      askerId: act.asker && act.asker.id ? act.asker.id : "",
      hospitalId: act.hospital && act.hospital.id ? act.hospital.id : "",
   }

   delete newAct.asker
   delete newAct.hospital
   delete newAct.user
   return newAct
}

ActDeclaration.getInitialProps = async ctx => {
   const {
      query: { id },
   } = ctx
   const { userId, hospitalId } = nextCookie(ctx)

   let act

   if (id) {
      try {
         const response = await fetch(API_URL + ACT_DETAIL_ENDPOINT + "/" + id)
         act = await handleAPIResponse(response)
      } catch (error) {
         console.error(error)
      }
   }

   let newAct
   if (act) {
      newAct = transformDBActForState(act)
   }

   return { act: newAct || {}, userId, hospitalId }
}

export default ActDeclaration
