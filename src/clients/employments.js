import fetch from "isomorphic-unfetch"
import { METHOD_PUT } from "../utils/http"

import { handleAPIResponse2 } from "../utils/errors"

import { API_URL, EMPLOYMENTS_ENDPOINT } from "../config"

export const findEmployment = async ({ hospitalId, year, month, headers }) => {
  const response = await fetch(API_URL + EMPLOYMENTS_ENDPOINT + `/${hospitalId}/${year}/${month}`, {
    headers: headers,
  })
  return handleAPIResponse2(response)
}

export const updateEmployment = async ({ hospitalId, year, month, dataMonth }) => {
  const response = await fetch(API_URL + EMPLOYMENTS_ENDPOINT + `/${hospitalId}/${year}/${month}`, {
    method: METHOD_PUT,
    body: JSON.stringify(dataMonth),
  })
  await handleAPIResponse2(response)
}
