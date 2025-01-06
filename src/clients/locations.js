import fetch from "isomorphic-unfetch"

import { LOCATIONS_ENDPOINT, API_URL } from "../config"
import { handleAPIResponse2 } from "../utils/errors"
import { METHOD_GET } from "../utils/http"

export const fetchOtherActLocations = async ({ headers }) => {
  const response = await fetch(`${API_URL}${LOCATIONS_ENDPOINT}`, { method: METHOD_GET, headers })
  return handleAPIResponse2(response)
}