import fetch from "isomorphic-unfetch"

import { API_URL, REFRESH_TOKEN_ENDPOINT } from "../config"
import { handleAPIResponse2 } from "../utils/errors"

export const refreshToken = async () => {
  const response = await fetch(API_URL + REFRESH_TOKEN_ENDPOINT)

  const tokenCookie = response.headers.get("Set-Cookie") // may be null in CSR mode or because of CORS or secure cookie. OK in SSR and good for us for testing purpose.

  const { user, token } = await handleAPIResponse2(response)

  if (!user) {
    throw new Error("Token refresh failed")
  }

  return {
    headers: {
      cookie: tokenCookie,
    },
    user,
    token,
  }
}
