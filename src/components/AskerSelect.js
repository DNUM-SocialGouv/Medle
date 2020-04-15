import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import AsyncSelect from "react-select/async"

import { memoizedFindAsker, memoizedSearchAskers } from "../clients/askers"

const AskerSelect = ({ dispatch, disabled, askerId }) => {
   const [existingValue, setExistingValue] = useState(null)
   const [previousValues, setPreviousValues] = useState([])

   useEffect(() => {
      const fetchAskerValue = async id => setExistingValue(id ? await memoizedFindAsker({ id }) : null)
      const fetchPreviousValues = async () => {
         Promise.all(memoizedFindAsker.values()).then(arr => {
            setPreviousValues(arr)
         })
      }

      fetchAskerValue(askerId)
      fetchPreviousValues()
   }, [askerId])

   const onChange = e => {
      dispatch({ type: "askerId", payload: { val: (e && e.value) || null } })
   }

   return (
      <>
         <AsyncSelect
            defaultOptions={previousValues}
            loadOptions={search => memoizedSearchAskers({ search })}
            isClearable={true}
            placeholder="Tapez le nom du demandeur"
            noOptionsMessage={() => "Aucun résultat"}
            loadingMessage={() => "Chargement..."}
            onChange={onChange}
            isDisabled={disabled}
            value={existingValue}
         />
      </>
   )
}

AskerSelect.propTypes = {
   dispatch: PropTypes.func.isRequired,
   disabled: PropTypes.bool,
   askerId: PropTypes.number,
}

export default AskerSelect
