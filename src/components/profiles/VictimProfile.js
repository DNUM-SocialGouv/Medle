import React from "react"
import ActBlock from "../ActBlock"
import PropTypes from "prop-types"
import { Title2 } from "../StyledComponents"
import { Col, Row } from "reactstrap"
import { periodOfDayValues, getSituationDate } from "../../utils/actsConstants"
import ColumnAct from "../../components/ColumnAct"

const getAttacks = () => {
   if (typeof sessionStorage !== "undefined") {
      return sessionStorage.getItem("attacks") ? JSON.parse(sessionStorage.getItem("attacks")).map(elt => elt.name) : []
   }
   return []
}

const VictimEdit = ({ dispatch, state, errors }) => {
   const situationDate = getSituationDate(state.examinationDate)
   const periods = periodOfDayValues[situationDate].period.map(elt => ({ title: elt.title, subTitle: elt.subTitle }))

   return (
      <>
         <ActBlock
            type="examinationTypes"
            title="Type(s) d'acte"
            values={["Somatique", "Psychiatrique"]}
            mode="toggleMultiple"
            dispatch={dispatch}
            state={state.examinationTypes || []}
            invalid={!!errors.examinationTypes}
         />
         <Title2 className="mb-4 mt-5">{"Type(s) de violence"}</Title2>

         <ActBlock
            type="violenceNatures"
            title=""
            subTitle="Nature"
            values={[
               "Coups blessures",
               "Sexuelle",
               "Maltraitance",
               { title: "Accident", subValues: ["Collectif", "Non collectif"] },
               { title: "Attentat", subValues: getAttacks() },
            ]}
            mode="toggleMultiple"
            dispatch={dispatch}
            state={state.violenceNatures || []}
            invalid={!!errors.violenceNatures}
         />
         <ActBlock
            type="violenceContexts"
            title=""
            subTitle="Contexte"
            values={[
               "Conjugale",
               "Infra-familiale (hors conjugale)",
               "Travail",
               "Voie publique",
               { title: "Autre type", subValues: ["Institution", "Scolaire", "Autre"] },
            ]}
            mode="toggleMultiple"
            dispatch={dispatch}
            state={state.violenceContexts || []}
            invalid={!!errors.violenceContexts}
         />
         <ActBlock
            type="examinations"
            title="Examens complémentaires"
            values={["Biologie", "Imagerie", "Toxicologie", "Génétique", "Autres"]}
            mode="toggleMultiple"
            dispatch={dispatch}
            state={state.examinations || []}
            invalid={!!errors.examinations}
         />
         <ActBlock
            type="location"
            title="Lieu de l'examen"
            values={[
               "UMJ",
               "Service d'hosp. public",
               "Service d'hosp. privé",
               "Établissement pénitentiaire",
               "Centre de rétention",
               "Maison de retraite",
               "Commissariat",
               "Gendarmerie",
            ]}
            mode="toggle"
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
            values={["0-2 ans", "3-17 ans", "+ de 18 ans"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.personAgeTag || ""}
            invalid={!!errors.personAgeTag}
         />
      </>
   )
}

const VictimRead = act => {
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
               <ColumnAct header={"Nature(s) de violence"} content={act && act.violenceNatures} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Contexte(s) de violence"} content={act && act.violenceContexts} />
            </Col>
         </Row>

         <Title2 className="pt-3">Profil</Title2>

         <Row>
            <Col className="mr-3">
               <ColumnAct header={"Examens complémentaires"} content={act && act.examinations} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Lieu de l'examen"} content={act.location} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Genre"} content={act && act.personGender} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Âge"} content={act && act.personAgeTag} />
            </Col>
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
   if (!state.violenceNatures || !state.violenceNatures.length) {
      errors.violenceNatures = "Obligatoire"
   }
   if (!state.violenceContexts || !state.violenceContexts.length) {
      errors.violenceContexts = "Obligatoire"
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

VictimEdit.propTypes = {
   dispatch: PropTypes.func.isRequired,
   state: PropTypes.object.isRequired,
   errors: PropTypes.object,
}

export default {
   edit: VictimEdit,
   read: VictimRead,
   hasErrors,
}
