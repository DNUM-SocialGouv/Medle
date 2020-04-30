import fetch from "isomorphic-unfetch"
import { saveAs } from "file-saver"

import { API_URL, ACTS_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"
import { METHOD_DELETE, METHOD_POST, METHOD_PUT } from "../utils/http"

export const findAct = async ({ id, headers }) => {
  const response = await fetch(API_URL + ACTS_ENDPOINT + "/" + id, { headers })
  return handleAPIResponse(response)
}

export const searchActsByKey = async ({ key, value, headers }) => {
  const response = await fetch(`${API_URL}${ACTS_ENDPOINT}?${key}=${value}`, {
    headers: { ...headers, "Content-Type": "application/json" },
  })
  const { elements } = await handleAPIResponse(response)
  return elements
}

export const searchActsFuzzy = async ({ search, requestedPage, headers }) => {
  const arr = []
  if (search) {
    arr.push(`fuzzy=${search}`)
  }
  if (requestedPage) {
    arr.push(`requestedPage=${requestedPage}`)
  }
  const bonus = arr.length ? "?" + arr.join("&") : ""
  const response = await fetch(`${API_URL}${ACTS_ENDPOINT}${bonus}`, { headers })

  return handleAPIResponse(response)
}

export const createAct = async ({ act, headers }) => {
  const response = await fetch(API_URL + ACTS_ENDPOINT, {
    method: METHOD_POST,
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(act),
  })
  return handleAPIResponse(response)
}

export const updateAct = async ({ act, headers }) => {
  const response = await fetch(API_URL + ACTS_ENDPOINT + "/" + act.id, {
    method: METHOD_PUT,
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(act),
  })
  return handleAPIResponse(response)
}

export const deleteAct = async ({ id, headers }) => {
  const response = await fetch(`${API_URL}${ACTS_ENDPOINT}/${id}`, { method: METHOD_DELETE, headers })
  return handleAPIResponse(response)
}

export const fetchExport = async search => {
  saveAs(`${API_URL}${ACTS_ENDPOINT}/export?fuzzy=${search}`)
}
