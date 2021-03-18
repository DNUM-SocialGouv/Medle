import { saveAs } from "file-saver"
import fetch from "isomorphic-unfetch"

import { API_URL, EMPLOYMENTS_ENDPOINT } from "../config"
import { handleAPIResponse2 } from "../utils/errors"
import { METHOD_PUT } from "../utils/http"
import { buildUrlWithParams } from "../utils/url"

export const findEmployment = async ({ hospitalId, year, month, headers }) => {
  const response = await fetch(API_URL + EMPLOYMENTS_ENDPOINT + `/${hospitalId}/${year}/${month}`, {
    headers: headers,
  })
  const res = await handleAPIResponse2(response)

  // bug Chrome/IE: some numbers are stored with comma and can't be parsed. Cast in Number before that.
  Object.keys(res).forEach((key) => (res[key] = Number(res[key])))

  return res
}

export const findLastEdit = async ({ hospitalId, headers }) => {
  const response = await fetch(API_URL + EMPLOYMENTS_ENDPOINT + `/${hospitalId}/last-edit`, {
    headers: headers,
  })
  return handleAPIResponse2(response)
}

export const updateEmployment = async ({ hospitalId, year, month, dataMonth }) => {
  const response = await fetch(API_URL + EMPLOYMENTS_ENDPOINT + `/${hospitalId}/${year}/${month}`, {
    body: JSON.stringify(dataMonth),
    method: METHOD_PUT,
  })
  await handleAPIResponse2(response)
}

export const exportEmployments = async ({ year, hospitals, headers }) => {
  const url = buildUrlWithParams(`${API_URL}${EMPLOYMENTS_ENDPOINT}/export`, { hospitals, year })

  saveAs(url.href, { headers })
}
