import { API_URL, ADMIN_USERS_ENDPOINT, RESET_PWD_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"
import { METHOD_DELETE, METHOD_PATCH, METHOD_POST, METHOD_PUT } from "../utils/http"
import fetch from "isomorphic-unfetch"

export const findUser = async ({ id, headers }) => {
   const response = await fetch(API_URL + ADMIN_USERS_ENDPOINT + "/" + id, { headers })
   return handleAPIResponse(response)
}

export const searchUsersFuzzy = async ({ search, requestedPage, headers }) => {
   const arr = []
   if (search) {
      arr.push(`fuzzy=${search}`)
   }
   if (requestedPage) {
      arr.push(`requestedPage=${requestedPage}`)
   }
   const bonus = arr.length ? "?" + arr.join("&") : ""
   const response = await fetch(`${API_URL}${ADMIN_USERS_ENDPOINT}${bonus}`, { headers })

   return handleAPIResponse(response)
}
export const createUser = async ({ user, headers }) => {
   const response = await fetch(`${API_URL}${ADMIN_USERS_ENDPOINT}`, {
      method: METHOD_POST,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(user),
   })
   return handleAPIResponse(response)
}

export const updateUser = async ({ user, headers }) => {
   const response = await fetch(`${API_URL}${ADMIN_USERS_ENDPOINT}/${user.id}`, {
      method: METHOD_PUT,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(user),
   })
   return handleAPIResponse(response)
}

export const deleteUser = async ({ id, headers }) => {
   const response = await fetch(`${API_URL}${ADMIN_USERS_ENDPOINT}/${id}`, { method: METHOD_DELETE, headers })
   return handleAPIResponse(response)
}

export const patchUser = async ({ id, password, headers }) => {
   const response = await fetch(`${API_URL}${RESET_PWD_ENDPOINT}`, {
      method: METHOD_PATCH,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
   })
   return handleAPIResponse(response)
}
