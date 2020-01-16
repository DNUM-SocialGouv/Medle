import React from "react"
import ActBlock from "../ActBlock"
import PropTypes from "prop-types"
import { Col, Row } from "reactstrap"
import ColumnAct from "../../components/ColumnAct"

const CriminalCourtEdit = ({ dispatch, state, errors }) => {
   return (
      <>
         <ActBlock
            type="mode"
            title="Modalités"
            values={["Présentiel", "En visioconférence"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.mode || []}
            invalid={!!errors.mode}
         />

         <ActBlock
            type="duration"
            title="Durée de la mobilisation"
            values={["- de 1 heure", "1 à 3 heures", "+ de 3 heures"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.duration || ""}
            invalid={!!errors.duration}
         />
      </>
   )
}

const hasErrors = state => {
   const errors = {}
   if (!state.mode || !state.mode.length) {
      errors.mode = "Obligatoire"
   }
   if (!state.duration) {
      errors.duration = "Obligatoire"
   }

   return errors
}

CriminalCourtEdit.propTypes = {
   dispatch: PropTypes.func.isRequired,
   state: PropTypes.object.isRequired,
   errors: PropTypes.object,
}

const CriminalCourtRead = act => {
   return (
      <>
         <Row>
            <Col className="mr-3">
               <ColumnAct header={"Statut"} values={act && act.profile} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Modalités"} values={act && act.mode} />
            </Col>
            <Col className="mr-3">
               <ColumnAct header={"Durée de la mobilisation"} values={act && act.duration} />
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
