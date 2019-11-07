import React, { useReducer, useRef, useState } from "react"
import PropTypes from "prop-types"
import Router from "next/router"
import fetch from "isomorphic-unfetch"
import { Alert, Col, Container, CustomInput, FormFeedback, Input, Row } from "reactstrap"
import moment from "moment"
import { ACT_DECLARATION_ENDPOINT } from "../config"
import { isEmpty, deleteProperty } from "../utils/misc"
import Layout from "../components/Layout"
import Counter from "../components/Counter"
import ActBlock from "../components/ActBlock"
import { Title1, Title2, Label, ValidationButton } from "../components/StyledComponents"
import { STATUS_200_OK } from "../utils/HttpStatus"
import {
   examinedPersonTypeValues,
   examinationTypeValues,
   violenceTypeValues,
   personGenderValues,
   personAgeTagValues,
   periodOfDayValues,
   getSituationDate,
   doctorWorkStatusValues as defaultValuesForDoctor,
} from "../utils/actsConstants"

const getIinitialState = asker => ({
   pvNumber: "",
   internalNumber: "",
   examinationDate: "",
   asker: asker ? asker : "",
   examinedPersonType: "",
   personGender: "",
   personAgeTag: "",
   examinationType: "",
   violenceType: "",
   periodOfDay: "",
   doctorWorkStatus: "",
   bloodExaminationsNumber: 0,
   xrayExaminationsNumber: 0,
   boneExaminationNumber: 0,
})

let dayInWeek = "week"

const reset = state => ({
   ...state,
   examinedPersonType: "",
   personGender: "",
   personAgeTag: "",
   examinationType: "",
   violenceType: "",
   periodOfDay: "",
   doctorWorkStatus: "",
   bloodExaminationsNumber: 0,
   xrayExaminationsNumber: 0,
   boneExaminationNumber: 0,
})

const getAskers = () => ["TGI Avignon", "TGI Marseille", "TGI Nîmes"]

const ActDeclaration = ({ askerValues }) => {
   const refPersonType = useRef()
   const [errors, setErrors] = useState({})
   const [doctorWorkStatusValues, setDoctorWorkStatusValues] = useState(defaultValuesForDoctor)

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
      let errors = {}

      if (!state.examinedPersonType) {
         errors = { ...errors, examinedPersonType: "Obligatoire" }
      }
      if (!state.personGender) {
         errors = { ...errors, personGender: "Obligatoire" }
      }
      if (!state.personAgeTag) {
         errors = { ...errors, personAgeTag: "Obligatoire" }
      }
      if (!state.examinationType) {
         errors = { ...errors, examinationType: "Obligatoire" }
      }
      if (!state.violenceType) {
         errors = { ...errors, violenceType: "Obligatoire" }
      }
      if (!state.periodOfDay) {
         errors = { ...errors, periodOfDay: "Obligatoire" }
      }
      if (!state.doctorWorkStatus) {
         errors = { ...errors, doctorWorkStatus: "Obligatoire" }
      }

      setErrors(precedentState => ({
         ...precedentState,
         ...errors,
      }))

      return isEmpty(errors)
   }

   const reducer = (state, action) => {
      switch (action.type) {
         case "internalNumber":
            setErrors(deleteProperty(errors, "internalNumber"))
            return { ...state, internalNumber: action.payload }
         case "pvNumber":
            return { ...state, pvNumber: action.payload }
         case "examinationDate":
            setErrors(deleteProperty(errors, "examinationDate"))
            dayInWeek = getSituationDate(action.payload)
            state.periodOfDay = ""
            state.doctorWorkStatus = ""
            return { ...state, examinationDate: action.payload }
         case "asker":
            return { ...state, asker: action.payload }
         case "examinedPersonType":
            setErrors({})
            if (preValidate(state)) {
               refPersonType.current.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
               })
               state = reset(state)
               setDoctorWorkStatusValues(defaultValuesForDoctor)
               return { ...state, examinedPersonType: action.payload }
            }
            return state
         case "examinationType":
            return { ...state, examinationType: action.payload }
         case "violenceType":
            return { ...state, violenceType: action.payload }
         case "periodOfDay":
            setDoctorWorkStatusValues(action.payload.doctorWorkStatusValues)
            return {
               ...state,
               doctorWorkStatus:
                  action.payload.doctorWorkStatusValues.length &&
                  action.payload.doctorWorkStatusValues.includes(state.doctorWorkStatus)
                     ? state.doctorWorkStatus
                     : "",
               periodOfDay: action.payload.periodOfDay,
            }
         case "doctorWorkStatus":
            return { ...state, doctorWorkStatus: action.payload }
         case "personGender":
            return { ...state, personGender: action.payload }
         case "personAgeTag":
            return { ...state, personAgeTag: action.payload }
         case "bloodExaminationsNumber":
            return { ...state, bloodExaminationsNumber: action.payload }
         case "xrayExaminationsNumber":
            return { ...state, xrayExaminationsNumber: action.payload }
         case "boneExaminationNumber":
            return { ...state, boneExaminationNumber: action.payload }
         default:
            throw new Error("Action.type inconnu")
      }
   }
   const [state, dispatch] = useReducer(reducer, getIinitialState(askerValues ? askerValues[0] : ""))

   const validAct = async () => {
      setErrors({})

      if (!fullValidate(state)) {
         return
      }

      let response, json

      try {
         response = await fetch(ACT_DECLARATION_ENDPOINT, {
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

            {!isEmpty(errors) && <Alert color="danger">{errors.general || "Erreur dans le formulaire"}</Alert>}
            <Row>
               <Col className="mr-3">
                  <Label htmlFor="internalNumber">Numéro interne</Label>
                  <Input
                     id="internalNumber"
                     invalid={errors && !!errors.internalNumber}
                     placeholder="Ex: 2019-23091"
                     onChange={e => dispatch({ type: e.target.id, payload: e.target.value })}
                  />
                  <FormFeedback>{errors && errors.internalNumber}</FormFeedback>
               </Col>
               <Col className="mr-3">
                  <Label htmlFor="pvNumber">Numéro de PV</Label>
                  <Input
                     id="pvNumber"
                     placeholder="Optionnel"
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

            <ActBlock type="examinedPersonType" values={examinedPersonTypeValues} dispatch={dispatch} state={state} />

            {state.examinedPersonType === "Victime" && (
               <>
                  <ActBlock
                     title={"Type(s) d'examen"}
                     type="examinationType"
                     values={examinationTypeValues}
                     dispatch={dispatch}
                     state={state}
                     invalid={errors && !!errors.examinationType}
                  />

                  <ActBlock
                     title={"Type(s) de violence"}
                     type="violenceType"
                     values={violenceTypeValues}
                     dispatch={dispatch}
                     state={state}
                     invalid={errors && !!errors.violenceType}
                  />

                  <ActBlock
                     title={`Heure de l'examen`}
                     type="periodOfDay"
                     values={periodOfDayValues[dayInWeek].period}
                     dispatch={dispatch}
                     state={state}
                     invalid={errors && !!errors.periodOfDay}
                  />

                  <ActBlock
                     title={`Statut du médecin`}
                     type="doctorWorkStatus"
                     values={doctorWorkStatusValues}
                     dispatch={dispatch}
                     state={state}
                     invalid={errors && !!errors.doctorWorkStatus}
                  />

                  <Title2 className="mb-4 mt-5">{"Examens complémentaires"}</Title2>

                  <Row>
                     <Col sm={4}>
                        <Counter dispatch={dispatch} state={state} type={"bloodExaminationsNumber"}>
                           Sanguins
                        </Counter>
                     </Col>
                     <Col sm={4}>
                        <Counter dispatch={dispatch} state={state} type={"xrayExaminationsNumber"}>
                           Radios
                        </Counter>
                     </Col>
                     <Col sm={4}>
                        <Counter dispatch={dispatch} state={state} type={"boneExaminationNumber"}>
                           Osseux
                        </Counter>
                     </Col>
                  </Row>

                  <Title2 className="mb-2 mt-5">{"Profil de la victime"}</Title2>

                  <ActBlock
                     subTitle={"Genre"}
                     type="personGender"
                     values={personGenderValues}
                     dispatch={dispatch}
                     state={state}
                     invalid={errors && !!errors.personGender}
                  />
                  <ActBlock
                     subTitle={"Âge"}
                     type="personAgeTag"
                     values={personAgeTagValues}
                     dispatch={dispatch}
                     state={state}
                     invalid={errors && !!errors.personAgeTag}
                  />
                  <div className="text-center mt-5">
                     <ValidationButton color="primary" size="lg" className="center" onClick={validAct}>
                        Valider
                     </ValidationButton>
                  </div>
               </>
            )}
         </Container>
      </Layout>
   )
}

ActDeclaration.propTypes = {
   askerValues: PropTypes.array,
}

ActDeclaration.getInitialProps = async () => {
   return { askerValues: getAskers() }
}

export default ActDeclaration
