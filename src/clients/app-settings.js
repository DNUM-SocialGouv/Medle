import fetch from "isomorphic-unfetch"

import { API_URL, APP_SETTINGS_ENDPOINT } from "../config"
import { handleAPIResponse2 } from "../utils/errors"
import { METHOD_PUT } from "../utils/http"

const appSettingsEndpoint = API_URL + APP_SETTINGS_ENDPOINT

export const findAppSettings = async (headers = {}) => {
  const response = await fetch(appSettingsEndpoint, { headers })
  return handleAPIResponse2(response)
}

export const updateAppSettings = async ({ usersPurgeInactivityDays, headers = {} }) => {
  const response = await fetch(appSettingsEndpoint, {
    body: JSON.stringify({ usersPurgeInactivityDays }),
    headers: { ...headers, "Content-Type": "application/json" },
    method: METHOD_PUT,
  })

  return handleAPIResponse2(response)
}