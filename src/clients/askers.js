import { API_URL, ASKERS_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"
import fetch from "isomorphic-unfetch"
import { isEmpty } from "../utils/misc"
import moize from "moize"

const MAX_AGE = 1000 * 60 * 60 // 1 hour

export const searchAskersFuzzy = async ({ search, all = false, headers }) => {
   search = search ? [`fuzzy=${search}`] : []
   all = all ? ["all=true"] : []

   let bonus = [...search, ...all]
   bonus = bonus.length ? `?${bonus.join("&")}` : ""

   const response = await fetch(`${API_URL}${ASKERS_ENDPOINT}${bonus}`, { headers })
   const json = await handleAPIResponse(response)
   return isEmpty(json) ? [] : json
}

export const findAsker = async ({ id, headers }) => {
   const response = await fetch(`${API_URL}${ASKERS_ENDPOINT}/${id}`, { headers })
   const json = await handleAPIResponse(response)
   return isEmpty(json) ? null : { value: id, label: json.name }
}

export const memoizedSearchAskers = moize({ maxAge: MAX_AGE, isPromise: false })(searchAskersFuzzy)
export const memoizedFindAsker = moize({ maxAge: MAX_AGE, isDeepEqual: true })(findAsker)
