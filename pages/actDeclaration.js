import React, { useState, useReducer } from "react"
import Router from "next/router"
import { Alert, Col, Container, CustomInput, Input, Row } from "reactstrap"
import { ACT_DECLARATION_ENDPOINT } from "../config"
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
   doctorWorkFormatValues,
   getSituationDate,
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
   doctorWorkFormat: "",
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
   doctorWorkFormat: "",
   bloodExaminationsNb: 0,
   radioExaminationsNb: 0,
   boneExaminationNb: 0,
})

const reducer = (state, action) => {
   switch (action.type) {
      case "internalNum":
         return { ...state, internalNum: action.payload }
      case "pvNum":
         return { ...state, pvNum: action.payload }
      case "examinationDate":
         dayInWeek = getSituationDate(action.payload)
         state.periodOfDay = ""
         state.doctorWorkFormat = ""
         return { ...state, examinationDate: action.payload }
      case "asker":
         return { ...state, asker: action.payload }
      case "examinedPersonType":
         ref.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
         })
         state = reset(state)
         return { ...state, examinedPersonType: action.payload }
      case "examinationType":
         return { ...state, examinationType: action.payload }
      case "violenceType":
         return { ...state, violenceType: action.payload }
      case "periodOfDay":
         return { ...state, periodOfDay: action.payload }
      case "doctorWorkFormat":
         return { ...state, doctorWorkFormat: action.payload }
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

const ActDeclaration = () => {
   const [isError, setIsError] = useState(false)
   const [isSuccess, setIsSuccess] = useState(false)

   const [state, dispatch] = useReducer(reducer, initialState)

   const validAct = async () => {
      setIsError(false)
      setIsSuccess(false)

      const data = {
         num_pv: state.pvNum,
         num_interne: state.internalNum,
         date_examen: state.examinationDate,
         demandeur: state.asker,
         periode_journee: state.periodOfDay,
         doctor_work_format: state.doctorWorkFormat ? state.doctorWorkFormat : "Médecin de garde",
         type_personne_examinee: state.typePersonExaminee,
         age_personne_examinee: state.profilAge,
         genre_personne_examinee: state.profilGenre,
         type_examen: state.typeExamen,
         type_violence: state.typeViolence,
         duree: 0, // TODO ajuster la durée ? À demander à Sania
         etablissement_sante_id: 1, // TODO : à récupérer du user courant
      }

      let response, json

      try {
         response = await fetch(ACT_DECLARATION_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
         })
         json = await response.json()
      } catch (error) {
         console.error(error)
         setIsError(true)
         return
      }

      if (response.status === STATUS_200_OK) {
         setIsSuccess("Déclaration envoyée")
         Router.push({
            pathname: "/actConfirmation",
            query: {
               id: data.num_interne,
               num_pv: data.num_pv,
            },
         })
      } else {
         setIsError(json && json.message ? json.message : "Problème de base de données")
      }
   }

   return (
      <Layout>
         <Title1 className="mt-5 mb-5">{"Déclaration d'acte"}</Title1>
         <Container className="w-75">
            <Title2 className="mb-4">{"Données d'identification du dossier"}</Title2>

            {isError && <Alert color="danger">{isError}</Alert>}
            {isSuccess && <Alert color="primary">{isSuccess}</Alert>}

            <Row>
               <Col className="mr-3">
                  <Label htmlFor="internalNum">Numéro de dossier interne</Label>
                  <Input
                     id="internalNum"
                     placeholder="Ex: 2019-23091"
                     onChange={e => dispatch({ type: e.target.id, payload: e.target.value })}
                  />
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
                     type="date"
                     onChange={e => dispatch({ type: e.target.id, payload: e.target.value })}
                  />
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
                  />

                  <ActBlock
                     title={`Statut du médecin`}
                     type="doctorWorkFormat"
                     values={doctorWorkFormatValues}
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
