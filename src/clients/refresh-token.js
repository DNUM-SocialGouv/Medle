import fetch from "isomorphic-unfetch"

import { API_URL, REFRESH_TOKEN_ENDPOINT } from "../config"
import { handleAPIResponse2 } from "../utils/errors"

export const refreshToken = async () => {
  const response = await fetch(API_URL + REFRESH_TOKEN_ENDPOINT)
  return handleAPIResponse2(response)
}
