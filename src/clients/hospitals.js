import fetch from "isomorphic-unfetch"

import { API_URL, HOSPITALS_ENDPOINT } from "../config"
import { handleAPIResponse2 } from "../utils/errors"
import { METHOD_DELETE, METHOD_POST, METHOD_PUT } from "../utils/http"
import { isEmpty } from "../utils/misc"

export const searchHospitalsFuzzy = async ({ search, headers }) => {
  const bonus = search ? `?fuzzy=${search}` : ""

  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}${bonus}`, { headers })
  const hospitals = await handleAPIResponse2(response)
  return isEmpty(hospitals) ? [] : hospitals
}

export const findHospital = async ({ id, headers }) => {
  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}/${id}`, { headers })
  return handleAPIResponse2(response)
}

export const findAllHospitals = async () => {
  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}`)
  return handleAPIResponse2(response)
}

export const createHospital = async ({ hospital, headers }) => {
  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}`, {
    method: METHOD_POST,
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(hospital),
  })
  return handleAPIResponse2(response)
}

export const updateHospital = async ({ hospital, headers }) => {
  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}/${hospital.id}`, {
    method: METHOD_PUT,
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(hospital),
  })
  return handleAPIResponse2(response)
}

export const deleteHospital = async ({ id, headers }) => {
  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}/${id}`, { method: METHOD_DELETE, headers })
  return handleAPIResponse2(response)
}
