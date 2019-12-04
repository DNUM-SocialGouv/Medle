import React, { useReducer, useRef, useState } from "react"
import PropTypes from "prop-types"
import Router, { useRouter } from "next/router"
import fetch from "isomorphic-unfetch"
import { Col, Container, CustomInput, FormFeedback, Input, Row } from "reactstrap"
import moment from "moment"
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
import { STATUS_200_OK } from "../utils/HttpStatus"

const getInitialState = ({ asker, internalNumber, pvNumber, act }) => {
   if (act && act.id) {
      return act
   } else {
      return {
         pvNumber: pvNumber ? pvNumber : "",
         internalNumber: internalNumber ? internalNumber : "",
         examinationDate: "",
         asker: asker ? asker : "",
         profile: "",
      }
   }
}

const resetState = state => ({
   pvNumber: state.pvNumber,
   internalNumber: state.internalNumber,
   examinationDate: state.examinationDate,
   asker: state.asker,
   profile: state.profile,
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

const getAskers = () => ["TGI Avignon", "TGI Marseille", "TGI Nîmes"]

const ActDeclaration = ({ askerValues, act }) => {
   const router = useRouter()
   const { internalNumber, pvNumber } = router.query
   const refPersonType = useRef()
   const [errors, setErrors] = useState({})

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

      setErrors(precedentState => ({
         ...precedentState,
         ...errors,
      }))

      return isEmpty(errors)
   }

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
         case "profile":
            setErrors({})
            if (action.payload.mode !== "lock") {
               state = resetState(state)
            }
            if (preValidate(state)) {
               refPersonType.current.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
               })
            }
            return state

         default:
            return state
      }
   }

   const [state, dispatch] = useReducer(
      reducer,
      getInitialState({ askerValues: askerValues ? askerValues[0] : "", internalNumber, pvNumber, act }),
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

   const getProfile = ({ profile }) => {
      return PROFILES[profile].render
   }

   const validAndSubmitAct = async () => {
      setErrors({})

      const newErrors = PROFILES[state.profile].validate(state)

      if (Object.keys(newErrors).length) {
         console.error("Erreur state non valide", state)
         setErrors(newErrors)
         return
      }

      console.log("pas d'erreurs trouvées")

      let response, json

      if (!state.id) {
         try {
            response = await fetch(API_URL + ACT_DECLARATION_ENDPOINT, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(state),
            })
            json = await response.json()

            if (response.status !== STATUS_200_OK) {
               throw new Error(json && json.message ? json.message : "")
            } else {
               console.log("Déclaration d'acte envoyée")
               return Router.push({
                  pathname: "/actConfirmation",
                  query: {
                     internalNumber: state.internalNumber,
                     pvNumber: state.pvNumber,
                  },
               })
            }
         } catch (error) {
            console.error(error)
            setErrors(errors => ({ ...errors, general: json && json.message ? json.message : "Erreur backoffice" }))
         }
      } else {
         try {
            response = await fetch(API_URL + ACT_EDIT_ENDPOINT + "/" + state.id, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(state),
            })
            json = await response.json()

            if (response.status !== STATUS_200_OK) {
               throw new Error(json && json.message ? json.message : "")
            } else {
               console.log("Déclaration d'acte envoyée")
               return Router.push({
                  pathname: "/actConfirmation",
                  query: {
                     internalNumber: state.internalNumber,
                     pvNumber: state.pvNumber,
                     edit: true,
                  },
               })
            }
         } catch (error) {
            console.error(error)
            setErrors(errors => ({ ...errors, general: json && json.message ? json.message : "Erreur backoffice" }))
         }
      }
   }
   return (
      <Layout>
         <Title1 className="mt-5 mb-5">{!state.id ? "Ajout d'acte" : "Modification d'un acte"}</Title1>
         <Container style={{ maxWidth: 720 }}>
            <Title2 className="mb-4">{"Données d'identification de l'acte"}</Title2>

            <Row>
               <Col className="mr-3">
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
               <Col className="mr-3">
                  <Label htmlFor="pvNumber">Numéro de PV</Label>
                  <Input
                     id="pvNumber"
                     placeholder="Optionnel"
                     value={state.pvNumber}
                     onChange={e => dispatch({ type: e.target.id, payload: e.target.value })}
                  />
               </Col>
               <Col className="mr-3">
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
                  <Label htmlFor="asker">Demandeur</Label>
                  <CustomInput
                     type="select"
                     id="asker"
                     name="asker"
                     onChange={e => dispatch({ type: e.target.id, payload: e.target.value })}
                  >
                     {askerValues.map((elt, index) => (
                        <option key={index}>{elt}</option>
                     ))}
                  </CustomInput>
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

            {state.profile && !errors.internalNumber && !errors.examinationDate && getProfile(state)}

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
   askerValues: PropTypes.array,
   act: PropTypes.object,
}

ActDeclaration.getInitialProps = async ({ query }) => {
   const { id } = query

   let act

   if (id) {
      try {
         const res = await fetch(API_URL + ACT_DETAIL_ENDPOINT + "/" + id)
         act = await res.json()
      } catch (error) {
         console.error(error)
      }
   }

   return { askerValues: getAskers(), act }
}

export default ActDeclaration
