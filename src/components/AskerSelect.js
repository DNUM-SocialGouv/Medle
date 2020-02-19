import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import AsyncSelect from "react-select/async"

import { API_URL, ASKERS_SEARCH_ENDPOINT, ASKERS_VIEW_ENDPOINT } from "../config"
import { isEmpty } from "../utils/misc"
import { handleAPIResponse } from "../utils/errors"

const getSuggestions = async value => {
   const bonus = value ? `?fuzzy=${value}` : ""

   let json
   try {
      const response = await fetch(`${API_URL}${ASKERS_SEARCH_ENDPOINT}${bonus}`)
      json = await handleAPIResponse(response)
   } catch (error) {
      console.error(error)
   }
   return isEmpty(json) ? [] : json
}

const cache = {}

const getAskerById = async id => {
   let json

   console.log("cache(id)", cache[id])

   if (cache[id]) return cache[id]

   try {
      const response = await fetch(`${API_URL}${ASKERS_VIEW_ENDPOINT}/${id}`)
      json = await handleAPIResponse(response)

      cache[id] = { value: id, label: json.name }
   } catch (error) {
      console.error(error)
   }
   return isEmpty(json) ? null : { value: id, label: json.name }
}

const emptyValue = { value: "", label: "" }

const AskerSelect = ({ dispatch, disabled, askerId }) => {
   const [existingValue, setExistingValue] = useState(emptyValue)

   useEffect(() => {
      const fetchData = async id => setExistingValue(id ? await getAskerById(id) : emptyValue)
      fetchData(askerId)
   }, [askerId])

   const onChange = e => {
      dispatch({ type: "askerId", payload: { val: (e && e.value) || null } })
   }

   return (
      <>
         <AsyncSelect
            defaultOptions={Object.values(cache)}
            loadOptions={getSuggestions}
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
