import React from "react"
import ActBlock from "../ActBlock"
import PropTypes from "prop-types"
import { Col, Row } from "reactstrap"
import ColumnAct from "../../components/ColumnAct"

const CriminalCourtEdit = ({ dispatch, state, errors }) => {
  return (
    <>
      <ActBlock
        type="duration"
        title="Durée de la mobilisation"
        values={["- de 3 heures", "3 à 6 heures", "+ de 6 heures"]}
        mode="toggle"
        dispatch={dispatch}
        state={state.duration || ""}
        invalid={!!errors.duration}
      />

      <ActBlock
        type="distance"
        title="Distance"
        values={["En visio", "- de 50 km", "50 à 150 km", "+ de 150 km"]}
        mode="toggle"
        dispatch={dispatch}
        state={state.distance || ""}
        invalid={!!errors.distance}
      />
    </>
  )
}

const hasErrors = (state) => {
  const errors = {}
  if (!state.duration) {
    errors.duration = "Obligatoire"
  }
  if (!state.distance) {
    errors.distance = "Obligatoire"
  }

  return errors
}

CriminalCourtEdit.propTypes = {
  dispatch: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  errors: PropTypes.object,
}

const CriminalCourtRead = (act) => {
  return (
    <>
      <Row>
        <Col className="mr-3">
          <ColumnAct header={"Statut"} content={act && act.profile} />
        </Col>
        <Col className="mr-3">
          <ColumnAct header={"Durée de la mobilisation"} content={act && act.duration} />
        </Col>
        <Col className="mr-3">
          <ColumnAct header={"Distance"} content={act && act.distance} />
        </Col>
      </Row>
    </>
  )
}

export default {
  edit: CriminalCourtEdit,
  read: CriminalCourtRead,
  hasErrors,
}
