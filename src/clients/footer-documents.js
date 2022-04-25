import fetch from "isomorphic-unfetch"

import { API_URL, FOOTER_DOCUMENTS_ENDPOINT } from "../config"
import { handleAPIBytesResponse, handleAPIResponse2 } from "../utils/errors"
import { METHOD_POST } from "../utils/http"
import { buildUrlWithParams } from "../utils/url"

export const getFooterDocument = async (type) => {
  const response = fetch(buildUrlWithParams(`${API_URL}${FOOTER_DOCUMENTS_ENDPOINT}`, { type }))
  return handleAPIBytesResponse(response)
}

export const updateFooterDocument = async ({ footerDocument, headers }, type) => {
  const formData = new FormData()
  formData.append("file", footerDocument, footerDocument.name)
  const response = await fetch(buildUrlWithParams(`${API_URL}${FOOTER_DOCUMENTS_ENDPOINT}`, { type }), {
    method: METHOD_POST,
    headers: { ...headers },
    body: formData,
  })
  return handleAPIResponse2(response)
}
