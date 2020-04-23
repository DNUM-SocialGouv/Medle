import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import AsyncSelect from "react-select/async"

import { memoizedFindAsker, memoizedSearchAskers } from "../clients/askers"
import { mapForSelect, mapArrayForSelect } from "../utils/select"

const AskerSelect = ({ dispatch, disabled, askerId }) => {
   const [existingValue, setExistingValue] = useState(null)
   const [previousValues, setPreviousValues] = useState([])

   useEffect(() => {
      const fetchAskerValue = async id => {
         const asker = id ? await memoizedFindAsker({ id }) : null
         setExistingValue(
            mapForSelect(
               asker,
               elt => elt.id,
               elt => elt.name + (elt.depCode ? ` (${elt.depCode})` : ""),
            ),
         )
      }
      const fetchPreviousValues = async () => {
         Promise.all(memoizedFindAsker.values()).then(arr => {
            setPreviousValues(
               mapArrayForSelect(
                  arr,
                  elt => elt.id,
                  elt => elt.name + (elt.depCode ? ` (${elt.depCode})` : ""),
               ),
            )
         })
      }

      fetchAskerValue(askerId)
      fetchPreviousValues()
   }, [askerId])

   const onChange = e => {
      dispatch({ type: "askerId", payload: { val: (e && e.value) || null } })
   }

   const loadAskers = async search => {
      const askers = await memoizedSearchAskers({ search })

      return mapArrayForSelect(
         askers?.elements,
         elt => elt.id,
         elt => elt.name + (elt.depCode ? ` (${elt.depCode})` : ""),
      )
   }

   return (
      <>
         <AsyncSelect
            defaultOptions={previousValues}
            loadOptions={search => loadAskers(search)}
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
