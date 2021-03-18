import fetch from "isomorphic-unfetch"

import { API_URL, HOSPITALS_ENDPOINT } from "../config"
import { handleAPIResponse2 } from "../utils/errors"
import { METHOD_DELETE, METHOD_POST, METHOD_PUT } from "../utils/http"

export const createReferences = async ({ payload, headers } = {}) => {
  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}/${payload?.hospitalId}/employments-references`, {
    body: JSON.stringify(payload),
    headers: { ...headers, "Content-Type": "application/json" },
    method: METHOD_POST,
  })
  return handleAPIResponse2(response)
}

export const updateReferences = async ({ payload, headers } = {}) => {
  const response = await fetch(
    `${API_URL}${HOSPITALS_ENDPOINT}/${payload?.hospitalId}/employments-references/${payload.id}`,
    {
      body: JSON.stringify(payload),
      headers: { ...headers, "Content-Type": "application/json" },
      method: METHOD_PUT,
    },
  )
  return handleAPIResponse2(response)
}

export const findReferences = async ({ hospitalId, headers }) => {
  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}/${hospitalId}/employments-references`, {
    headers,
  })
  return handleAPIResponse2(response)
}

export const findReference = async ({ hospitalId, referencesId, headers }) => {
  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}/${hospitalId}/employments-references/${referencesId}`, {
    headers,
  })
  return handleAPIResponse2(response)
}

export const searchReferenceForMonth = async ({ hospitalId, year, month, headers }) => {
  const query = `?type=searchByMonth`
  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}/${hospitalId}/employments-references${query}`, {
    body: JSON.stringify({ month, year }),
    headers: { ...headers, "Content-Type": "application/json" },
    method: METHOD_POST,
  })
  return handleAPIResponse2(response)
}

export const deleteReference = async ({ hospitalId, referencesId, headers }) => {
  const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}/${hospitalId}/employments-references/${referencesId}`, {
    headers,
    method: METHOD_DELETE,
  })
  return handleAPIResponse2(response)
}
