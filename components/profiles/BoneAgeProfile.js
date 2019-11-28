import React from "react"
import ActBlock from "../ActBlock"
import PropTypes from "prop-types"
import { Title2 } from "../StyledComponents"
import { periodOfDayValues, getSituationDate } from "../../utils/actsConstants"

const BoneAgeProfile = ({ dispatch, state, examinationDate, errors }) => {
   const situationDate = getSituationDate(examinationDate)
   const periods = periodOfDayValues[situationDate].period.map(elt => ({ title: elt.title, subTitle: elt.subTitle }))

   return (
      <>
         <ActBlock
            type="examinationTypes"
            title="Type(s) d'examen"
            values={["Scanner", "Radiographie", "Panoramique dentaire"]}
            mode="toggleMultiple"
            dispatch={dispatch}
            state={state.examinationTypes || []}
            invalid={errors.examinationTypes}
         />

         <ActBlock
            type="periodOfDay"
            title="Heure de l'examen"
            values={periods}
            mode="toggle"
            dispatch={dispatch}
            state={state.periodOfDay || ""}
            invalid={errors.periodOfDay}
         />

         <Title2 className="mb-2 mt-5">{"Profil de la personne décédée"}</Title2>

         <ActBlock
            type="personGender"
            title=""
            subTitle="Genre"
            values={["Féminin", "Masculin", "Autre", "Non déterminé"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.personGender || ""}
            invalid={errors.personGender}
         />
      </>
   )
}

BoneAgeProfile.validate = state => {
   const errors = {}
   if (!state.examinationTypes.length) {
      errors.examinationTypes = "Obligatoire"
   }
   if (!state.periodOfDay) {
      errors.periodOfDay = "Obligatoire"
   }
   if (!state.personGender) {
      errors.personGender = "Obligatoire"
   }

   return errors
}

BoneAgeProfile.propTypes = {
   dispatch: PropTypes.func.isRequired,
   state: PropTypes.object.isRequired,
   examinationDate: PropTypes.string,
   errors: PropTypes.object,
}

export default BoneAgeProfile
