import PropTypes from "prop-types"
import React from "react"
import { Col, Row } from "reactstrap"

import ColumnAct from "../../components/ColumnAct"
import ActBlock from "../ActBlock"

const ReconstitutionEdit = ({ dispatch, state, errors }) => {
  return (
    <>
      <ActBlock
        type="duration"
        title="Durée de la mobilisation"
        values={["- de 4 heures", "4 à 8 heures", "+ de 8 heures"]}
        mode="toggle"
        dispatch={dispatch}
        state={state.duration || ""}
        invalid={!!errors.duration}
      />

      <ActBlock
        type="distance"
        title="Distance"
        values={["- de 50 km", "50 à 150 km", "+ de 150 km"]}
        mode="toggle"
        dispatch={dispatch}
        state={state.distance || ""}
        invalid={!!errors.distance}
      />
    </>
  )
}

const ReconstitutionRead = (act) => {
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
          <ColumnAct header={"Distance"} content={act.distance} />
        </Col>
        <Col className="mr-3" />
      </Row>
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

ReconstitutionEdit.propTypes = {
  dispatch: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  errors: PropTypes.object,
}

const Reconstitution = {
  edit: ReconstitutionEdit,
  read: ReconstitutionRead,
  hasErrors,
}

export default Reconstitution 
