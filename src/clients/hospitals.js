import fetch from "isomorphic-unfetch"

import { API_URL, HOSPITALS_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"
import { METHOD_POST, METHOD_PUT, METHOD_DELETE } from "../utils/http"
import { isEmpty } from "../utils/misc"

export const searchHospitalsFuzzy = async ({ search, headers }) => {
  const bonus = search ? `?fuzzy=${search}` : ""

  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}${bonus}`, { headers })
  const hospitals = await handleAPIResponse(response)
  return isEmpty(hospitals) ? [] : hospitals
}

export const findHospital = async ({ id, headers }) => {
  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}/${id}`, { headers })
  return handleAPIResponse(response)
}

export const createHospital = async ({ hospital, headers }) => {
  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}`, {
    method: METHOD_POST,
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(hospital),
  })
  return handleAPIResponse(response)
}

export const updateHospital = async ({ hospital, headers }) => {
  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}/${hospital.id}`, {
    method: METHOD_PUT,
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(hospital),
  })
  return handleAPIResponse(response)
}

export const deleteHospital = async ({ id, headers }) => {
  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}/${id}`, { method: METHOD_DELETE, headers })
  return handleAPIResponse(response)
}
