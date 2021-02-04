import fetch from "isomorphic-unfetch"
import moize from "moize"

import { API_URL, ASKERS_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"
import { METHOD_DELETE, METHOD_POST, METHOD_PUT } from "../utils/http"

const MAX_AGE = 1000 * 60 * 60 // 1 hour

export const searchAskersFuzzy = async ({ search, requestedPage, headers }) => {
  const arr = []
  if (search) {
    arr.push(`fuzzy=${search}`)
  }
  if (requestedPage) {
    arr.push(`requestedPage=${requestedPage}`)
  }
  const bonus = arr.length ? "?" + arr.join("&") : ""

  const response = await fetch(`${API_URL}${ASKERS_ENDPOINT}${bonus}`, { headers })
  return handleAPIResponse(response)
}

export const findAsker = async ({ id, headers }) => {
  const response = await fetch(`${API_URL}${ASKERS_ENDPOINT}/${id}`, { headers })
  return handleAPIResponse(response)
}

export const memoizedSearchAskers = moize({ maxAge: MAX_AGE, isPromise: false })(searchAskersFuzzy)
export const memoizedFindAsker = moize({ maxAge: MAX_AGE, isDeepEqual: true })(findAsker)

export const createAsker = async ({ asker, headers }) => {
  const response = await fetch(`${API_URL}${ASKERS_ENDPOINT}`, {
    method: METHOD_POST,
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(asker),
  })

  return handleAPIResponse(response)
}

export const updateAsker = async ({ asker, headers }) => {
  const response = await fetch(`${API_URL}${ASKERS_ENDPOINT}/${asker.id}`, {
    method: METHOD_PUT,
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(asker),
  })
  return handleAPIResponse(response)
}

export const deleteAsker = async ({ id, headers }) => {
  const response = await fetch(`${API_URL}${ASKERS_ENDPOINT}/${id}`, { method: METHOD_DELETE, headers })
  return handleAPIResponse(response)
}
