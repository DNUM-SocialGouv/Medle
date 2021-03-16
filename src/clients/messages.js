import fetch from "isomorphic-unfetch"

import { API_URL, MESSAGES_ENDPOINT } from "../config"
import { handleAPIResponse2 } from "../utils/errors"
import { buildUrlWithParams } from "../utils/url"

const messageEndpoint = API_URL + MESSAGES_ENDPOINT

const makeMessageEndpointQuery = (queryParams = {}) => async (headers = {}) => {
  const response = await fetch(buildUrlWithParams(messageEndpoint, queryParams), {
    headers,
  })
  return handleAPIResponse2(response)
}

export const findAllActiveMessages = makeMessageEndpointQuery()

export const findAllMessages = makeMessageEndpointQuery({ queryAll: true })

export const createMessage = async (message) => {
  const response = await fetch(buildUrlWithParams(messageEndpoint), {
    body: JSON.stringify(message),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })

  return handleAPIResponse2(response)
}

export const deleteMessage = async (id) => {
  const response = await fetch(buildUrlWithParams(messageEndpoint, { id }), {
    method: "DELETE",
  })
  return handleAPIResponse2(response)
}
