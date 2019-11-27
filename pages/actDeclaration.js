import React, { useReducer, useRef, useState } from "react"
import PropTypes from "prop-types"
import Router, { useRouter } from "next/router"
import fetch from "isomorphic-unfetch"
import { Alert, Col, Container, CustomInput, FormFeedback, Input, Row } from "reactstrap"
import moment from "moment"
import { API_URL, ACT_DECLARATION_ENDPOINT } from "../config"
import { isEmpty, deleteProperty } from "../utils/misc"
import Layout from "../components/Layout"
import ActBlock from "../components/ActBlock"
import VictimProfile from "../components/VictimProfile"
import { Title1, Title2, Label, ValidationButton } from "../components/StyledComponents"
import { STATUS_200_OK } from "../utils/HttpStatus"
import { profileValues, runProfiledValidation, getSituationDate } from "../utils/actsConstants"

const getInitialState = ({ asker, internalNumber, pvNumber }) => ({
   pvNumber: pvNumber ? pvNumber : "",
   internalNumber: internalNumber ? internalNumber : "",
   examinationDate: "",
   asker: asker ? asker : "",
   situationDate: "week",
   ...reset({}),
})

const reset = state => ({
   ...state,
   profile: "",
   personGender: "",
   personAgeTag: "",
   examinationTypes: [],
   violenceTypes: [],
   periodOfDay: "",
   bioExaminationsNumber: 0,
   imagingExaminationsNumber: 0,
   othersExaminationNumber: 0,
   multipleVisits: undefined,
   location: "",
})

const getAskers = () => ["TGI Avignon", "TGI Marseille", "TGI Nîmes"]

const ActDeclaration = ({ askerValues }) => {
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

   const fullValidate = state => {
      if (!preValidate(state)) {
         return false
      }

      return runProfiledValidation(state.profile, state, setErrors)
   }

   const reducer = (state, action) => {
      if (action.payload.mode === "toggle") {
         const part = state[action.type] || ""
         if (part === action.payload.val) {
            state = { ...state, [action.type]: "" }
         } else {
            state = { ...state, [action.type]: action.payload.val }
         }
      } else if (action.payload.mode === "toggleMultiple") {
         const parts = state[action.type] || []
         const index = parts.indexOf(action.payload.val)
         if (index !== -1) {
            state = { ...state, [action.type]: [...parts.slice(0, index), ...parts.slice(index + 1)] }
         } else {
            const chunks = action.payload.val.split("/")
            let prefix = "",
               newState = state[action.type]
            if (chunks.length === 2) {
               prefix = chunks[0]
               newState = state[action.type].filter(e => !e.startsWith(prefix))
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
            return { ...state, situationDate: getSituationDate(action.payload), examinationDate: action.payload }
         case "asker":
            return { ...state, asker: action.payload }
         case "profile":
            setErrors({})
            if (preValidate(state)) {
               refPersonType.current.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
               })
               state = reset(state)

               console.log("profile", state, action.payload)
               return { ...state, profile: action.payload.val }
            }
            return state
         // case "examinationTypes":
         //    return { ...state, examinationTypes: addOrRemoveInArr(action.payload, state.examinationTypes) }
         // case "violenceTypes":
         //    return { ...state, violenceTypes: addOrRemoveInArr(action.payload, state.violenceTypes) }
         // case "periodOfDay":
         //    return {
         //       ...state,
         //       periodOfDay: action.payload,
         //    }
         // case "personGender":
         //    return { ...state, personGender: action.payload }
         // case "personAgeTag":
         //    return { ...state, personAgeTag: action.payload }
         // case "bioExaminationsNumber":
         //    return { ...state, bioExaminationsNumber: action.payload }
         // case "imagingExaminationsNumber":
         //    return { ...state, imagingExaminationsNumber: action.payload }
         // case "othersExaminationNumber":
         //    return { ...state, othersExaminationNumber: action.payload }
         // case "multipleVisits":
         //    return { ...state, multipleVisits: action.payload }
         // case "location":
         //    return { ...state, location: action.payload }
         // default:
         //    throw new Error("Action.type inconnu")
         default:
            return state
      }
   }

   console.log(
      "initial state",
      getInitialState({ askerValues: askerValues ? askerValues[0] : "", internalNumber, pvNumber }),
   )

   const [state, dispatch] = useReducer(
      reducer,
      getInitialState({ askerValues: askerValues ? askerValues[0] : "", internalNumber, pvNumber }),
   )

   const PROFILES = {
      Victime: {
         render: <VictimProfile dispatch={dispatch} state={state} errors={errors} />,
         validate: VictimProfile.validate,
      },
   }

   const getProfile = ({ profile }) => {
      return PROFILES[profile].render
   }

   const validAct = async () => {
      setErrors({})

      const newErrors = PROFILES[state.profile].validate({ state, errors })

      if (Object.keys(newErrors).length) {
         setErrors(newErrors)
         return
      }

      console.log("pas d'erreurs trouvées")

      let response, json

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
   }

   return (
      <Layout>
         <Title1 className="mt-5 mb-5">{"Déclaration d'acte"}</Title1>
         <Container style={{ maxWidth: 720 }}>
            <Title2 className="mb-4">{"Données d'identification du dossier"}</Title2>

            {!isEmpty(errors) && (
               <Alert color="danger">{errors.general || "Veuillez renseigner les éléments en rouge"}</Alert>
            )}
            <Row>
               <Col className="mr-3">
                  <Label htmlFor="internalNumber">Numéro interne</Label>
                  <Input
                     id="internalNumber"
                     invalid={errors && !!errors.internalNumber}
                     placeholder="Ex: 2019-23091"
                     value={state.internalNumber}
                     onChange={e => dispatch({ type: e.target.id, payload: e.target.value })}
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

            <ActBlock type="profile" values={profileValues} dispatch={dispatch} state={state.profile} />

            {state.profile && getProfile(state)}

            <div className="text-center mt-5">
               <ValidationButton color="primary" size="lg" className="center" onClick={validAct}>
                  Valider
               </ValidationButton>
            </div>
         </Container>
      </Layout>
   )
}

ActDeclaration.propTypes = {
   askerValues: PropTypes.array,
   internalNumber: PropTypes.string,
   pvNumber: PropTypes.string,
}

ActDeclaration.getInitialProps = async () => {
   return { askerValues: getAskers() }
}

export default ActDeclaration
