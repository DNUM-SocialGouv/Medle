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

const buildQueryParams = (params) => {
  const { search, startDate, endDate, hospitals, profiles, asker, requestedPage } = params

  const arr = []
  if (search) {
    arr.push(`fuzzy=${search}`)
  }
  if (startDate) {
    arr.push(`startDate=${startDate}`)
  }
  if (endDate) {
    arr.push(`endDate=${endDate}`)
  }
  if (hospitals?.length) {
    arr.push(`hospitals=${hospitals.map((elt) => elt.value).join(",")}`)
  }
  if (profiles?.length) {
    arr.push(`profiles=${profiles.map((elt) => elt.value).join(",")}`)
  }
  if (asker?.value) {
    arr.push(`asker=${asker?.value}`)
  }
  if (requestedPage) {
    arr.push(`requestedPage=${requestedPage}`)
  }
  return arr.length ? "?" + arr.join("&") : ""
}

export const searchActs = async (params) => {
  const { headers } = params

  const queryParams = buildQueryParams(params)

  const response = await fetch(`${API_URL}${ACTS_ENDPOINT}${queryParams}`, { headers })

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

export const fetchExport = async (params) => {
  const { headers } = params

  const queryParams = buildQueryParams(params)

  saveAs(`${API_URL}${ACTS_ENDPOINT}/export${queryParams}`, { headers })
}
