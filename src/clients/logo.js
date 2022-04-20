import fetch from "isomorphic-unfetch"

import { API_URL, LOGO_ENDPOINT } from "../config"
import { handleAPIResponse2 } from "../utils/errors"
import { METHOD_GET, METHOD_PUT } from "../utils/http"
import { buildUrlWithParams } from "../utils/url"

export const findLogo = async () => {
    const response = await fetch(`${API_URL}${LOGO_ENDPOINT}`)
    return handleAPIResponse2(response)
}

export const updateLogo = async ({ logo, headers }) => {
    const formData = new FormData()
    formData.append("file", logo)
    const response = await fetch(`${API_URL}${LOGO_ENDPOINT}`, {
      method: METHOD_PUT,
      headers: { ...headers, "Content-Type":"multipart/form-data" },
      body: formData,
    })
    return handleAPIResponse2(response)
}