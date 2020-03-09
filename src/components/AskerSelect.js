import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import AsyncSelect from "react-select/async"
import moize from "moize"

import { API_URL, ASKERS_SEARCH_ENDPOINT, ASKERS_VIEW_ENDPOINT } from "../config"
import { isEmpty } from "../utils/misc"
import { handleAPIResponse } from "../utils/errors"
import { logError } from "../utils/logger"

const getSuggestions = async value => {
   const bonus = value ? `?fuzzy=${value}` : ""

   let json
   try {
      const response = await fetch(`${API_URL}${ASKERS_SEARCH_ENDPOINT}${bonus}`)
      json = await handleAPIResponse(response)
   } catch (error) {
      logError(error)
   }
   return isEmpty(json) ? [] : json
}

const getAskerById = async id => {
   let json

   try {
      const response = await fetch(`${API_URL}${ASKERS_VIEW_ENDPOINT}/${id}`)
      json = await handleAPIResponse(response)
   } catch (error) {
      logError(error)
   }
   return isEmpty(json) ? null : { value: id, label: json.name }
}

const MAX_AGE = 1000 * 60 * 60 // 1 hour
const memoizedGetSuggestions = moize({ maxAge: MAX_AGE, isPromise: false })(getSuggestions)
const memoizedGetAskerById = moize({ maxAge: MAX_AGE })(getAskerById)

const emptyValue = { value: "", label: "" }

const AskerSelect = ({ dispatch, disabled, askerId }) => {
   const [existingValue, setExistingValue] = useState(emptyValue)
   const [previousValues, setPreviousValues] = useState([])

   useEffect(() => {
      const fetchAskerValue = async id => setExistingValue(id ? await memoizedGetAskerById(id) : emptyValue)
      const fetchPreviousValues = async () => {
         Promise.all(memoizedGetAskerById.values()).then(arr => {
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
            loadOptions={memoizedGetSuggestions}
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
