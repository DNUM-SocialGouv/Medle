import fetch from "isomorphic-unfetch"

import { API_URL, ATTACKS_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"

export const findAllAttacks = async ({ headers } = {}) => {
  const response = await fetch(API_URL + ATTACKS_ENDPOINT, { headers })
  return handleAPIResponse(response)
}
