import PropTypes from "prop-types"
import React from "react"
import { Col, Row } from "reactstrap"

import ActBlock from "../ActBlock"
import ColumnAct from "../ColumnAct"

const FileStudyEdit = ({ dispatch, state, errors }) => {
  return (
    <>
      <ActBlock
        type="duration"
        title="Durée"
        values={["- de 2 heures", "2 à 4 heures", "4 à 8 heures", "+ de 8 heures"]}
        mode="toggle"
        dispatch={dispatch}
        state={state.duration || ""}
        invalid={!!errors.duration}
      />
    </>
  )
}

const FileStudyRead = (act) => {
  return (
    <>
      <Row>
        <Col className="mr-3">
          <ColumnAct header={"Durée de la mobilisation"} content={act && act.duration} />
        </Col>
      </Row>
    </>
  )
}

const hasErrors = (state) => {
  const errors = {}
  if (!state.duration) {
    errors.duration = "Obligatoire"
  }

  return errors
}

FileStudyEdit.propTypes = {
  dispatch: PropTypes.func.isRequired,
  errors: PropTypes.object,
  state: PropTypes.object.isRequired,
}

export default {
  edit: FileStudyEdit,
  hasErrors,
  read: FileStudyRead,
}
