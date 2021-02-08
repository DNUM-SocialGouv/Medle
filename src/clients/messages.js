import fetch from "isomorphic-unfetch"

import { API_URL, MESSAGES_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"

const messageEndpoint = API_URL + MESSAGES_ENDPOINT

const getMessageEndpointWithQueryParams = (params = {}) => {
  const url = new URL(messageEndpoint)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
  return url
}

const makeMessageEndpointQuery = (queryParams = {}) => async (headers = {}) => {
  const response = await fetch(getMessageEndpointWithQueryParams(queryParams), {
    headers,
  })
  return handleAPIResponse(response)
}

export const findAllActiveMessages = makeMessageEndpointQuery()

export const findAllMessages = makeMessageEndpointQuery({ queryAll: true })

export const createMessage = async (message) => {
  const response = await fetch(getMessageEndpointWithQueryParams(), {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(message),
  })

  return handleAPIResponse(response)
}

export const deleteMessage = async (id) => {
  const response = await fetch(getMessageEndpointWithQueryParams({ id }), {
    method: "DELETE",
  })
  return handleAPIResponse(response)
}
