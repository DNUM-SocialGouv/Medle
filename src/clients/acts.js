import { API_URL, ACTS_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"
import { METHOD_POST } from "../utils/http"
import fetch from "isomorphic-unfetch"
import { buildAuthHeaders } from "../utils/auth"

export const createAct = async act => {
   const response = await fetch(API_URL + ACTS_ENDPOINT, {
      method: METHOD_POST,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(act),
   })
   return handleAPIResponse(response)
}

export const getAct = async (id, ctx = null) => {
   const authHeaders = buildAuthHeaders(ctx)

   const response = await fetch(API_URL + ACTS_ENDPOINT + "/" + id, { headers: authHeaders })
   return handleAPIResponse(response)
}
