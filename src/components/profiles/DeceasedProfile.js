import React from "react"
import ActBlock from "../ActBlock"
import PropTypes from "prop-types"
import { Title2 } from "../StyledComponents"
import { Col, Row } from "reactstrap"
import { periodOfDayValues, getSituationDate } from "../../utils/actsConstants"
import ColumnAct from "../../components/ColumnAct"

const DeceasedEdit = ({ dispatch, state, errors }) => {
   const situationDate = getSituationDate(state.examinationDate)
   const periods = periodOfDayValues[situationDate].period.map(elt => ({ title: elt.title, subTitle: elt.subTitle }))

   return (
      <>
         <ActBlock
            type="examinationTypes"
            title="Type(s) d'acte"
            values={["Examen externe", "Levée de corps", "Autopsie", "Anthropologie", "Odontologie"]}
            mode="toggleMultiple"
            dispatch={dispatch}
            state={state.examinationTypes || []}
            invalid={!!errors.examinationTypes}
         />
         <ActBlock
            type="examinations"
            title="Examens complémentaires"
            values={["Imageries", "Toxicologiques", "Anapath", "Génétiques", "Autres"]}
            mode="toggleMultiple"
            dispatch={dispatch}
            state={state.examinations || []}
            invalid={!!errors.examinations}
         />

         {/* <Title2 className="mb-4 mt-5">{"Examens complémentaires"}</Title2>
         <Row>
            <Col>
               <Counter
                  dispatch={dispatch}
                  state={state.imagingExaminationsNumber || 0}
                  type={"imagingExaminationsNumber"}
               >
                  Imagerie
               </Counter>
            </Col>
            <Col>
               <Counter dispatch={dispatch} state={state.toxicExaminationsNumber || 0} type={"toxicExaminationsNumber"}>
                  Toxicologie
               </Counter>
            </Col>
            <Col>
               <Counter
                  dispatch={dispatch}
                  state={state.anapathExaminationsNumber || 0}
                  type={"anapathExaminationsNumber"}
               >
                  Anapath
               </Counter>
            </Col>
            <Col>
               <Counter
                  dispatch={dispatch}
                  state={state.geneticExaminationsNumber || 0}
                  type={"geneticExaminationsNumber"}
               >
                  Génétique
               </Counter>
            </Col>
            <Col>
               <Counter dispatch={dispatch} state={state.othersExaminationNumber || 0} type={"othersExaminationNumber"}>
                  Autres
               </Counter>
            </Col>
         </Row> */}
         <ActBlock
            type="periodOfDay"
            title="Heure de l'examen"
            values={periods}
            mode="toggle"
            dispatch={dispatch}
            state={state.periodOfDay || ""}
            invalid={!!errors.periodOfDay}
         />

         <Title2 className="mb-2 mt-5">{"Profil de la personne décédée"}</Title2>

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
            values={["0-2 ans", "3-17 ans", "+ de 18 ans", "Non déterminé"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.personAgeTag || ""}
            invalid={!!errors.personAgeTag}
         />
      </>
   )
}

const DeceasedRead = act => {
   // const examinations = [
   //    [act.imagingExaminationsNumber, "imagerie"],
   //    [act.toxicExaminationsNumber, "toxicologie"],
   //    [act.anapathExaminationsNumber, "anapath"],
   //    [act.geneticExaminationsNumber, "génétique"],
   //    [act.othersExaminationNumber, "autre"],
   // ]
   //    .filter(elt => !!elt[0])
   //    .map(elt => elt.join(" "))

   return (
      <>
         <Row>
            <Col className="mr-3">
               <ColumnAct header={"Statut"} content={act && act.profile} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Type(s) d'acte"} content={act && act.examinationTypes} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Examens complémentaires"} content={act && act.examinations} />
            </Col>
            <Col className="mr-3"></Col>
         </Row>

         <Title2 className="pt-3">Profil</Title2>

         <Row>
            <Col className="mr-3">
               <ColumnAct header={"Genre"} content={act && act.personGender} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Âge"} content={act && act.personAgeTag} />
            </Col>
            <Col className="mr-3"></Col>
            <Col className="mr-3"></Col>
         </Row>
      </>
   )
}

const hasErrors = state => {
   const errors = {}
   if (!state.examinationTypes || !state.examinationTypes.length) {
      errors.examinationTypes = "Obligatoire"
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

DeceasedEdit.propTypes = {
   dispatch: PropTypes.func.isRequired,
   state: PropTypes.object.isRequired,
   errors: PropTypes.object,
}

export default {
   edit: DeceasedEdit,
   read: DeceasedRead,
   hasErrors,
}
