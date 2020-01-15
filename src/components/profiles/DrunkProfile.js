import React from "react"
import ActBlock from "../ActBlock"
import PropTypes from "prop-types"
import { Title2 } from "../StyledComponents"
import { Col, Row } from "reactstrap"
import Counter from "../Counter"
import { periodOfDayValues, getSituationDate } from "../../utils/actsConstants"
import ColumnAct from "../../components/ColumnAct"

const DrunkProfile = ({ dispatch, state, errors }) => {
   const situationDate = getSituationDate(state.examinationDate)
   const periods = periodOfDayValues[situationDate].period.map(elt => ({ title: elt.title, subTitle: elt.subTitle }))

   return (
      <>
         <ActBlock
            type="examinationTypes"
            title="Type(s) d'acte"
            values={["Somatique"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.examinationTypes || []}
            invalid={!!errors.examinationTypes}
         />
         <Title2 className="mb-4 mt-5">{"Examens complémentaires"}</Title2>
         <Row>
            <Col>
               <Counter dispatch={dispatch} state={state.bioExaminationsNumber || 0} type={"bioExaminationsNumber"}>
                  Biologiques
               </Counter>
            </Col>
         </Row>

         <ActBlock
            type="location"
            title="Lieu de l'examen"
            values={["UMJ", "Commissariat", "Gendarmerie", "In situ"]}
            mode="toggleMultiple"
            dispatch={dispatch}
            state={state.location || []}
            invalid={!!errors.location}
         />

         <ActBlock
            type="periodOfDay"
            title="Heure de l'examen"
            values={periods}
            mode="toggle"
            dispatch={dispatch}
            state={state.periodOfDay || ""}
            invalid={!!errors.periodOfDay}
         />

         <Title2 className="mb-2 mt-5">{"Profil de la personne examinée"}</Title2>

         <ActBlock
            type="personGender"
            title=""
            subTitle="Genre"
            values={["Féminin", "Masculin", "Autre genre", "Non déterminé"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.personGender || ""}
            invalid={!!errors.personGender}
         />
         <ActBlock
            type="personAgeTag"
            title=""
            subTitle="Âge"
            values={["Mineur", "Majeur", "Non déterminé"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.personAgeTag || ""}
            invalid={!!errors.personAgeTag}
         />
      </>
   )
}

export const DrunkDetail = act => {
   const examinations = [[act.bioExaminationsNumber, "biologique"]].filter(elt => !!elt[0]).map(elt => elt.join(" "))

   return (
      <>
         <Row>
            <Col className="mr-3">
               <ColumnAct header={"Statut"} values={act && act.profile} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Type(s) d'acte"} values={act && act.examinationTypes} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Examens complémentaires"} values={examinations} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Lieu de l'examen"} values={act.location} />
            </Col>
         </Row>

         <Title2>Profil</Title2>

         <Row>
            <Col className="mr-3">
               <ColumnAct header={"Genre"} values={act && act.personGender} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Âge"} values={act && act.personAgeTag} />
            </Col>
            <Col className="mr-3"></Col>
            <Col className="mr-3"></Col>
         </Row>
      </>
   )
}

DrunkProfile.hasErrors = state => {
   const errors = {}
   if (!state.examinationTypes || !state.examinationTypes.length) {
      errors.examinationTypes = "Obligatoire"
   }

   if (!state.location) {
      errors.location = "Obligatoire"
   }
   if (!state.periodOfDay) {
      errors.periodOfDay = "Obligatoire"
   }
   if (!state.personGender) {
      errors.personGender = "Obligatoire"
   }
   if (!state.personAgeTag) {
      errors.personAgeTag = "Obligatoire"
   }

   return errors
}

DrunkProfile.propTypes = {
   dispatch: PropTypes.func.isRequired,
   state: PropTypes.object.isRequired,
   errors: PropTypes.object,
}

export default DrunkProfile
