import React, { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import Autosuggest from "react-autosuggest"
import { API_URL, ASKERS_SEARCH_ENDPOINT, ASKERS_VIEW_ENDPOINT } from "../config"
import { isEmpty } from "../utils/misc"
import { handleAPIResponse } from "../utils/errors"
import { useTraceUpdate } from "../utils/debug"

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

const getAskerById = async _id => {
   const id = parseInt(_id, 10)

   if (isNaN(id)) {
      return ""
   }

   let json

   try {
      const response = await fetch(`${API_URL}${ASKERS_VIEW_ENDPOINT}/${id}`)
      json = await handleAPIResponse(response)
   } catch (error) {
      console.error(error)
   }
   return isEmpty(json) ? "" : json.name
}

const AskerAutocomplete = props => {
   const { dispatch, id, askerId, error, disabled } = props
   useTraceUpdate(props)

   // console.log("AskerAutocomplete:render")
   const [autoSuggestData, setAutoSuggestData] = useState({ value: "", suggestions: [] })

   const refValue = useRef("")

   useEffect(() => {
      const setAskerName = async id => {
         // ref pour que useEffect ne re render pas en cas de nouveau autoSuggestData.value
         let askerName = refValue.current
         if (id) {
            askerName = await getAskerById(id)
         }
         // console.log("AskerAutocomplete:useEffect", askerName)
         setAutoSuggestData({ value: askerName, suggestions: [] })
      }
      if (!disabled) {
         setAskerName(askerId)
      } else {
         refValue.current = ""
      }
   }, [askerId, disabled])

   const onAutoSuggestChange = (event, { newValue }) => {
      refValue.current = newValue
      setAutoSuggestData(prev => ({ ...prev, value: newValue }))
   }

   const onSuggestionsFetchRequested = async ({ value }) => {
      const suggestions = await getSuggestions(value)
      setAutoSuggestData({ value, suggestions })
   }

   const onSuggestionsClearRequested = () => {
      setAutoSuggestData(prev => ({ ...prev, suggestions: [] }))
   }

   const shouldRenderSuggestions = value => value.trim().length > 2

   const inputProps = {
      placeholder: "Tapez le nom du demandeur",
      value: autoSuggestData.value,
      onChange: onAutoSuggestChange,
      onBlur: async () => {
         if (!autoSuggestData.value) return
         const suggestions = await getSuggestions(autoSuggestData.value)
         if (suggestions && suggestions.length) {
            if (suggestions.length === 1) {
               if (autoSuggestData.value.trim().toUpperCase() === suggestions[0].name.toUpperCase()) {
                  dispatch({ type: "askerId", payload: { val: suggestions[0].id } })
               } else {
                  dispatch({ type: "askerId", payload: { val: null } })
               }
            } else if (suggestions.length > 1) {
               let hasDispatched = false
               suggestions.forEach(elt => {
                  if (autoSuggestData.value.trim().toUpperCase() === elt.name.toUpperCase()) {
                     dispatch({ type: "askerId", payload: { val: elt.id } })
                     hasDispatched = true
                  }
               })
               if (!hasDispatched) {
                  dispatch({ type: "askerId", payload: { val: null } })
               }
            } else {
               dispatch({ type: "askerId", payload: { val: null } })
            }
         } else {
            dispatch({ type: "askerId", payload: { val: null } })
         }
      },
   }

   const getSuggestionValue = suggestion => {
      return suggestion.name
   }

   const renderSuggestion = suggestion => <div>{suggestion.name}</div>

   if (disabled) {
      return (
         <>
            <input disabled className="input-disabled"></input>
            <style jsx>{`
               .input-disabled {
                  width: 100%;
                  display: block;
                  height: calc(1.5em + 0.75rem + 2px);
                  padding: 6px 12px;
                  font-weight: 400;
                  font-size: 1rem;
                  border: 1px solid ${error ? "#d63626" : "#ced4da"};
                  border-radius: 0.25rem;
                  -webkit-appearance: none;
                  background-clip: "padding-box";
                  color: #495057;
                  background-color: #dddddd;
               }
            `}</style>
         </>
      )
   } else {
      return (
         <>
            <Autosuggest
               id={id}
               suggestions={autoSuggestData.suggestions}
               onSuggestionsFetchRequested={onSuggestionsFetchRequested}
               onSuggestionsClearRequested={onSuggestionsClearRequested}
               getSuggestionValue={getSuggestionValue}
               shouldRenderSuggestions={shouldRenderSuggestions}
               renderSuggestion={renderSuggestion}
               inputProps={inputProps}
            />

            <style jsx global>{`
               .react-autosuggest__container {
                  position: relative;
               }

               .react-autosuggest__input {
                  width: 100%;
                  display: block;
                  height: calc(1.5em + 0.75rem + 2px);
                  padding: 6px 12px;
                  font-weight: 400;
                  font-size: 1rem;
                  border: 1px solid ${error ? "#d63626" : "#ced4da"};
                  border-radius: 0.25rem;
                  -webkit-appearance: none;
                  background-clip: "padding-box";
                  color: #495057;
                  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
               }

               .react-autosuggest__input--focused {
                  color: #495057;
                  background-color: #fff;
                  border-color: #3492ff;
                  outline: 0;
                  box-shadow: 0 0 0 0.2rem rgba(0, 83, 179, 0.25);
               }

               .react-autosuggest__input::-ms-clear {
                  display: none;
               }

               .react-autosuggest__input--open {
                  border-bottom-left-radius: 0;
                  border-bottom-right-radius: 0;
               }

               .react-autosuggest__suggestions-container {
                  display: none;
               }

               .react-autosuggest__suggestions-container--open {
                  display: block;
                  position: relative;
                  top: -1px;
                  width: 280px;
                  border: 1px solid #aaa;
                  background-color: #fff;
                  font-weight: 400;
                  font-size: 1rem;
                  border-bottom-left-radius: 4px;
                  border-bottom-right-radius: 4px;
                  z-index: 2;
               }

               .react-autosuggest__suggestions-list {
                  margin: 0;
                  padding: 0;
                  list-style-type: none;
               }

               .react-autosuggest__suggestion {
                  cursor: pointer;
                  padding: 10px 20px;
               }

               .react-autosuggest__suggestion--highlighted {
                  background-color: #ddd;
               }
            `}</style>
         </>
      )
   }
}

AskerAutocomplete.propTypes = {
   dispatch: PropTypes.func.isRequired,
   id: PropTypes.string,
   askerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
   error: PropTypes.string,
   disabled: PropTypes.bool,
}

export default AskerAutocomplete
