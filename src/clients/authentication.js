import fetch from "isomorphic-unfetch"

import { API_URL, LOGIN_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"
import { METHOD_POST } from "../utils/http"

export const authenticate = async (email, password) => {
  const response = await fetch(API_URL + LOGIN_ENDPOINT, {
    method: METHOD_POST,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const token = response.headers.get("Set-Cookie") // may be null in CSR mode or because of CORS or secure cookie. OK in SSR and good for us for testing purpose.

  const user = await handleAPIResponse(response)

  if (!user) {
    throw new Error("Authentication failed")
  }

  return {
    headers: {
      cookie: token,
    },
    user,
  }
}
