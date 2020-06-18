import fetch from "isomorphic-unfetch"

import { API_URL, MESSAGES_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"

export const findAllMessages = async () => {
  const response = await fetch(API_URL + MESSAGES_ENDPOINT)
  return handleAPIResponse(response)
}
