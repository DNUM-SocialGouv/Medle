import { API_URL, HOSPITALS_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"
import fetch from "isomorphic-unfetch"
import { isEmpty } from "../utils/misc"

export const searchHospitalsFuzzy = async ({ search, headers }) => {
   const bonus = search ? `?fuzzy=${search}` : ""

   const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}${bonus}`, { headers })
   const hospitals = await handleAPIResponse(response)
   return isEmpty(hospitals) ? [] : hospitals
}
