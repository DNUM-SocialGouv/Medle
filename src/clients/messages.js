import fetch from "isomorphic-unfetch"

import { API_URL, MESSAGES_ENDPOINT } from "../config"
import { handleAPIResponse2 } from "../utils/errors"

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
  return handleAPIResponse2(response)
}

export const findAllActiveMessages = makeMessageEndpointQuery()

export const findAllMessages = makeMessageEndpointQuery({ queryAll: true })

export const createMessage = async (message) => {
  const response = await fetch(getMessageEndpointWithQueryParams(), {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(message),
  })

  return handleAPIResponse2(response)
}

export const deleteMessage = async (id) => {
  const response = await fetch(getMessageEndpointWithQueryParams({ id }), {
    method: "DELETE",
  })
  return handleAPIResponse2(response)
}
