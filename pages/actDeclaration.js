import React, { useReducer, useState } from "react"
import Router from "next/router"
import fetch from "isomorphic-unfetch"
import { Alert, Col, Container, CustomInput, FormFeedback, Input, Row } from "reactstrap"
import moment from "moment"
import { ACT_DECLARATION_ENDPOINT } from "../config"
import { isEmpty } from "../utils/misc"
import Layout from "../components/Layout"
import Counter from "../components/Counter"
import ActBlock from "../components/ActBlock"
import { Title1, Title2, Label, ValidationButton } from "../components/StyledComponents"
import { STATUS_200_OK } from "../utils/HttpStatus"
import {
   examinedPersonTypeValues,
   examinationTypeValues,
   violenceTypeValues,
   examinedPersonGenderValues,
   examinedPersonAgeValues,
   periodOfDayValues,
   getSituationDate,
   doctorWorkStatusValues as defaultValuesForDoctor,
} from "../utils/actsConstants"

const initialState = {
   pvNum: "",
   internalNum: "",
   examinationDate: "",
   asker: "",
   examinedPersonType: "",
   examinedPersonGender: "",
   examinedPersonAge: "",
   examinationType: "",
   violenceType: "",
   periodOfDay: "",
   doctorWorkStatus: "",
   bloodExaminationsNb: 0,
   radioExaminationsNb: 0,
   boneExaminationNb: 0,
}

const ref = React.createRef()

let dayInWeek = "week"

const reset = state => ({
   ...state,
   examinedPersonType: "",
   examinedPersonGender: "",
   examinedPersonAge: "",
   examinationType: "",
   violenceType: "",
   periodOfDay: "",
   doctorWorkStatus: "",
   bloodExaminationsNb: 0,
   radioExaminationsNb: 0,
   boneExaminationNb: 0,
})

const ActDeclaration = () => {
   const [errors, setErrors] = useState({})
   const [doctorWorkStatusValues, setDoctorWorkStatusValues] = useState(defaultValuesForDoctor)

   const preValidate = state => {
      let errors = {}
      if (!state.internalNum) {
         errors = { ...errors, internalNum: "Obligatoire" }
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

   const deleteProperty = (obj, property) => {
      const res = { ...obj }
      delete res[property]
      return res
   }

   const reducer = (state, action) => {
      switch (action.type) {
         case "internalNum":
            setErrors(deleteProperty(errors, "internalNum"))
            return { ...state, internalNum: action.payload }
         case "pvNum":
            return { ...state, pvNum: action.payload }
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
               ref.current.scrollIntoView({
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
                  action.payload.doctorWorkStatusValues.length === 1 ? action.payload.doctorWorkStatusValues[0] : "",
               periodOfDay: action.payload.periodOfDay,
            }
         case "doctorWorkStatus":
            return { ...state, doctorWorkStatus: action.payload }
         case "examinedPersonGender":
            return { ...state, examinedPersonGender: action.payload }
         case "examinedPersonAge":
            return { ...state, examinedPersonAge: action.payload }
         case "bloodExaminationsNb":
            return { ...state, bloodExaminationsNb: action.payload }
         case "radioExaminationsNb":
            return { ...state, radioExaminationsNb: action.payload }
         case "boneExaminationNb":
            return { ...state, boneExaminationNb: action.payload }
         default:
            throw new Error("Action.type inconnu")
      }
   }
   const [state, dispatch] = useReducer(reducer, initialState)

   const validAct = async () => {
      setErrors({})

      if (!preValidate(state)) {
         return
      }

      if (!state.periodOfDay) {
         setErrors(errors => ({ ...errors, periodOfDay: "Obligatoire" }))
         return
      }

      const data = {
         num_pv: state.pvNum,
         num_interne: state.internalNum,
         date_examen: state.examinationDate,
         demandeur: state.asker,
         periode_journee: state.periodOfDay,
         doctor_work_format: state.doctorWorkStatus,
         type_personne_examinee: state.typePersonExaminee,
         age_personne_examinee: state.profilAge,
         genre_personne_examinee: state.profilGenre,
         type_examen: state.typeExamen,
         type_violence: state.typeViolence,
      }

      let response, json

      try {
         response = await fetch(ACT_DECLARATION_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
         })
         json = await response.json()

         if (response.status !== STATUS_200_OK) {
            throw new Error(json && json.message ? json.message : "")
         } else {
            console.log("Déclaration d'acte envoyée")
            Router.push({
               pathname: "/actConfirmation",
               query: {
                  id: data.num_interne,
                  num_pv: data.num_pv,
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

            {errors && errors.general && <Alert color="danger">{errors.general}</Alert>}
            <Row>
               <Col className="mr-3">
                  <Label htmlFor="internalNum">Numéro interne</Label>
                  <Input
                     id="internalNum"
                     invalid={errors && errors.internalNum}
                     placeholder="Ex: 2019-23091"
                     onChange={e => dispatch({ type: e.target.id, payload: e.target.value })}
                  />
                  <FormFeedback>{errors && errors.internalNum}</FormFeedback>
               </Col>
               <Col className="mr-3">
                  <Label htmlFor="pvNum">Numéro de PV</Label>
                  <Input
                     id="pvNum"
                     placeholder="Optionnel"
                     onChange={e => dispatch({ type: e.target.id, payload: e.target.value })}
                  />
               </Col>
               <Col className="mr-3">
                  <Label htmlFor="examinationDate">{"Date d'examen"}</Label>
                  <Input
                     id="examinationDate"
                     invalid={errors && errors.examinationDate}
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
                     <option>TGI Marseille</option>
                     <option>TGI Avignon</option>
                     <option>TGI Nîmes</option>
                  </CustomInput>
               </Col>
            </Row>

            <Title2 className="mb-4 mt-5" ref={ref}>
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
                  />

                  <ActBlock
                     title={"Type(s) de violence"}
                     type="violenceType"
                     values={violenceTypeValues}
                     dispatch={dispatch}
                     state={state}
                  />

                  <ActBlock
                     title={`Heure de l'examen`}
                     type="periodOfDay"
                     values={periodOfDayValues[dayInWeek].period}
                     dispatch={dispatch}
                     state={state}
                     invalid={errors && errors.periodOfDay}
                  />

                  <ActBlock
                     title={`Statut du médecin`}
                     type="doctorWorkStatus"
                     values={doctorWorkStatusValues}
                     dispatch={dispatch}
                     state={state}
                  />

                  <Title2 className="mb-4 mt-5">{"Examens complémentaires"}</Title2>

                  <Row>
                     <Col sm={4}>
                        <Counter dispatch={dispatch} state={state} type={"bloodExaminationsNb"}>
                           Sanguins
                        </Counter>
                     </Col>
                     <Col sm={4}>
                        <Counter dispatch={dispatch} state={state} type={"radioExaminationsNb"}>
                           Radios
                        </Counter>
                     </Col>
                     <Col sm={4}>
                        <Counter dispatch={dispatch} state={state} type={"boneExaminationNb"}>
                           Osseux
                        </Counter>
                     </Col>
                  </Row>

                  <Title2 className="mb-2 mt-5">{"Profil de la victime"}</Title2>

                  <ActBlock
                     subTitle={"Genre"}
                     type="examinedPersonGender"
                     values={examinedPersonGenderValues}
                     dispatch={dispatch}
                     state={state}
                  />
                  <ActBlock
                     subTitle={"Âge"}
                     type="examinedPersonAge"
                     values={examinedPersonAgeValues}
                     dispatch={dispatch}
                     state={state}
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

export default ActDeclaration
