import React from "react"
import ActBlock from "./ActBlock"
import PropTypes from "prop-types"

const CriminalCourtProfile = ({ dispatch, state, errors }) => {
   return (
      <>
         <ActBlock
            type="mode"
            title="Modalités"
            values={["Présentiel", "À distance"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.mode || []}
            invalid={errors.mode}
         />

         <ActBlock
            type="duration"
            title="Durée de la mobilisation"
            values={["- de 1 heure", "1 à 3 heures", "+ de 3 heures"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.duration || ""}
            invalid={errors.duration}
         />
      </>
   )
}

CriminalCourtProfile.validate = state => {
   const errors = {}
   if (!state.mode.length) {
      errors.mode = "Obligatoire"
   }
   if (!state.duration) {
      errors.duration = "Obligatoire"
   }

   return errors
}

CriminalCourtProfile.propTypes = {
   dispatch: PropTypes.func.isRequired,
   state: PropTypes.object.isRequired,
   examinationDate: PropTypes.string,
   errors: PropTypes.object,
}

export default CriminalCourtProfile
