import PropTypes from "prop-types"
import React from "react"
import { Col, Row } from "reactstrap"

import ColumnAct from "../../components/ColumnAct"
import { getSituationDate, periodOfDayValues } from "../../utils/actsConstants"
import ActBlock from "../ActBlock"
import { Title2 } from "../StyledComponents"

const examinationsUMJ = ["Examen externe", "Levée de corps"]
const examinationsIML = [...examinationsUMJ, "Autopsie", "Anthropologie", "Odontologie"]

const DeceasedEdit = ({ dispatch, state, errors, hospital }) => {
  const situationDate = getSituationDate(state.examinationDate)
  const periods = periodOfDayValues[situationDate].period.map((elt) => ({ subTitle: elt.subTitle, title: elt.title }))

  const personTitle = "Profil de la personne décédée"

  return (
    <>
      <ActBlock
        type="examinationTypes"
        title="Type(s) d'acte"
        values={hospital?.canDoPostMortem ? examinationsIML : examinationsUMJ}
        mode="toggleMultiple"
        dispatch={dispatch}
        state={state.examinationTypes || []}
        invalid={!!errors.examinationTypes}
      />
      {state.examinationTypes && state.examinationTypes.includes("Levée de corps") && (
        <ActBlock
          type="distance"
          title="Distance"
          values={["- de 50 km", "50 à 150 km", "+ de 150 km"]}
          mode="toggle"
          dispatch={dispatch}
          state={state.distance || ""}
          invalid={!!errors.distance}
        />
      )}
      <ActBlock
        type="examinations"
        title="Prélèvements et examens complémentaires"
        values={["Biologie", "Imagerie", "Toxicologie", "Anapath", "Génétique", "Autres"]}
        mode="toggleMultiple"
        dispatch={dispatch}
        state={state.examinations || []}
        invalid={!!errors.examinations}
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
      <ActBlock
        type="deathCause"
        title="Quelle est la cause présumée du décès ?"
        values={["Suicide", "Suicide probable", "Autre"]}
        mode="toggle"
        dispatch={dispatch}
        state={state.deathCause || ""}
        invalid={!!errors.deathCause}
      />

      <Title2 className="mt-5 mb-2">{personTitle}</Title2>

      <ActBlock
        type="personGender"
        title={personTitle}
        subTitle="Genre"
        values={["Féminin", "Masculin", "Autre genre", "Non déterminé"]}
        mode="toggle"
        dispatch={dispatch}
        state={state.personGender || ""}
        invalid={!!errors.personGender}
      />
      <ActBlock
        type="personAgeTag"
        title={personTitle}
        subTitle="Âge"
        values={["0-2 ans", "3-5 ans", "6-10 ans", "11-14 ans", "15-17 ans", "+ de 18 ans", "Non déterminé"]}
        mode="toggle"
        dispatch={dispatch}
        state={state.personAgeTag || ""}
        invalid={!!errors.personAgeTag}
      />
    </>
  )
}

const DeceasedRead = (act) => {
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
          <ColumnAct header={"Prélèvements et examens complémentaires"} content={act && act.examinations} />
        </Col>
        <Col className="mr-3">{act.distance && <ColumnAct header={"Distance"} content={act && act.distance} />}</Col>
      </Row>

      <Title2 className="pt-3">Profil</Title2>

      <Row>
        <Col className="mr-3">
          <ColumnAct header={"Genre"} content={act && act.personGender} />
        </Col>
        <Col className="mr-3">
          <ColumnAct header={"Âge"} content={act && act.personAgeTag} />
        </Col>
        <Col className="mr-3">
          <ColumnAct header={"Cause du décès"} content={act && act.deathCause} />
        </Col>
        <Col className="mr-3" />
      </Row>
    </>
  )
}

const hasErrors = (state) => {
  const errors = {}
  if (!state.examinationTypes?.length) {
    errors.examinationTypes = "Obligatoire"
  }
  if (state.examinationTypes && state.examinationTypes.includes("Levée de corps") && !state.distance) {
    errors.distance = "Obligatoire"
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
  if (!state.deathCause) {
    errors.deathCause = "Obligatoire"
  }

  return errors
}

DeceasedEdit.propTypes = {
  dispatch: PropTypes.func.isRequired,
  errors: PropTypes.object,
  hospital: PropTypes.object,
  state: PropTypes.object.isRequired,
}

const Deceased = {
  edit: DeceasedEdit,
  hasErrors,
  read: DeceasedRead,
}

export default Deceased 
