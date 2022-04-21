import fetch from "isomorphic-unfetch"

import { API_URL, LOGO_ENDPOINT } from "../config"
import { handleAPIBytesResponse, handleAPIResponse2 } from "../utils/errors"
import { METHOD_POST } from "../utils/http"

export const findLogo = async () => {
    const response = await fetch(`${API_URL}${LOGO_ENDPOINT}`)
    return handleAPIBytesResponse(response)
}

export const updateLogo = async ({ logo, headers }) => {
    const formData = new FormData()
    formData.append("file", logo, logo.name)
    const response = await fetch(`${API_URL}${LOGO_ENDPOINT}`, {
      method: METHOD_POST,
      headers: { ...headers },
      body: formData,
    })
    return handleAPIResponse2(response)
}