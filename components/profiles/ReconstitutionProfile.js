import React from "react"
import ActBlock from "../ActBlock"
import PropTypes from "prop-types"

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

ReconstitutionProfile.validate = state => {
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
   examinationDate: PropTypes.string,
   errors: PropTypes.object,
}

export default ReconstitutionProfile
