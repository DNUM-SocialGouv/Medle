import PropTypes from "prop-types"
import React from "react"
import { Col, Row } from "reactstrap"

import ColumnAct from "../../components/ColumnAct"
import { getSituationDate, periodOfDayValues } from "../../utils/actsConstants"
import ActBlock from "../ActBlock"
import { Title2 } from "../StyledComponents"

const RestrainedEdit = ({ dispatch, state, errors }) => {
  const situationDate = getSituationDate(state.examinationDate)
  const periods = periodOfDayValues[situationDate].period.map((elt) => ({ title: elt.title, subTitle: elt.subTitle }))

  const personTitle = "Profil de la personne retenue"

  return (
    <>
      <ActBlock
        type="examinationTypes"
        title="Type(s) d'acte"
        detail="Note : l'examen psychiatrique est réalisé sur réquisition judiciaire par un psychiatre. Ne sont pas concernées : expertise pénale, évaluation psychologique."
        values={["Somatique", "Psychiatrique"]}
        mode="toggleMultiple"
        dispatch={dispatch}
        state={state.examinationTypes || []}
        invalid={!!errors.examinationTypes}
      />
      <ActBlock
        type="examinations"
        title="Prélèvements et examens complémentaires"
        values={["Biologie", "Imagerie", "Autres"]}
        mode="toggleMultiple"
        dispatch={dispatch}
        state={state.examinations || []}
        invalid={!!errors.examinations}
      />
      <ActBlock
        type="location"
        title="Lieu de l'examen"
        values={["UMJ", "Locaux douaniers", "Centre de rétention", "Commissariat", "Gendarmerie"]}
        mode="toggle"
        dispatch={dispatch}
        state={state.location || ""}
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
        values={["Mineur", "Majeur", "Non déterminé"]}
        mode="toggle"
        dispatch={dispatch}
        state={state.personAgeTag || ""}
        invalid={!!errors.personAgeTag}
      />
    </>
  )
}

const RestrainedRead = (act) => {
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
      </Row>
      <Row>
        <Col className="mr-3">
          <ColumnAct header={"Lieu de l'examen"} content={act.location} />
        </Col>
        <Col className="mr-3" />
        <Col className="mr-3" />
        <Col className="mr-3" />
      </Row>

      <Title2 className="pt-3">Profil</Title2>

      <Row>
        <Col className="mr-3">
          <ColumnAct header={"Genre"} content={act && act.personGender} />
        </Col>
        <Col className="mr-3">
          <ColumnAct header={"Âge"} content={act && act.personAgeTag} />
        </Col>
        <Col className="mr-3" />
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

RestrainedEdit.propTypes = {
  dispatch: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  errors: PropTypes.object,
}
const Restrained = {
  edit: RestrainedEdit,
  read: RestrainedRead,
  hasErrors,
}

export default Restrained