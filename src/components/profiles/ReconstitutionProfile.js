import React from "react"
import ActBlock from "../ActBlock"
import PropTypes from "prop-types"
import { Col, Row } from "reactstrap"
import ColumnAct from "../../components/ColumnAct"

const ReconstitutionProfile = ({ dispatch, state, errors }) => {
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
            title="Distance du lieu de reconstitution"
            values={["- de 50 km", "50 à 150 km", "+ de 150 km"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.distance || []}
            invalid={!!errors.distance}
         />
      </>
   )
}

export const ReconstitutionDetail = act => {
   return (
      <>
         <Row>
            <Col className="mr-3">
               <ColumnAct header={"Statut"} values={act && act.profile} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Durée de la mobilisation"} values={act && act.duration} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Distance du lieu de reconstitution"} values={act.distance} />
            </Col>
            <Col className="mr-3"></Col>
         </Row>
      </>
   )
}

ReconstitutionProfile.hasErrors = state => {
   const errors = {}
   if (!state.duration) {
      errors.duration = "Obligatoire"
   }
   if (!state.distance) {
      errors.distance = "Obligatoire"
   }

   return errors
}

ReconstitutionProfile.propTypes = {
   dispatch: PropTypes.func.isRequired,
   state: PropTypes.object.isRequired,
   errors: PropTypes.object,
}

export default ReconstitutionProfile
