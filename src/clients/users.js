import fetch from "isomorphic-unfetch"

import { API_URL, RESET_PWD_ENDPOINT, USERS_ENDPOINT } from "../config"
import { handleAPIResponse2 } from "../utils/errors"
import { METHOD_DELETE, METHOD_PATCH, METHOD_POST, METHOD_PUT } from "../utils/http"

export const findUser = async ({ id, headers }) => {
  const response = await fetch(API_URL + USERS_ENDPOINT + "/" + id, { headers })
  return handleAPIResponse2(response)
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
  const response = await fetch(`${API_URL}${USERS_ENDPOINT}${bonus}`, { headers })

  return handleAPIResponse2(response)
}
export const createUser = async ({ user, headers }) => {
  const response = await fetch(`${API_URL}${USERS_ENDPOINT}`, {
    method: METHOD_POST,
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
  return handleAPIResponse2(response)
}

export const updateUser = async ({ user, headers }) => {
  const response = await fetch(`${API_URL}${USERS_ENDPOINT}/${user.id}`, {
    method: METHOD_PUT,
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
  return handleAPIResponse2(response)
}

export const deleteUser = async ({ id, headers }) => {
  const response = await fetch(`${API_URL}${USERS_ENDPOINT}/${id}`, { method: METHOD_DELETE, headers })
  return handleAPIResponse2(response)
}

export const patchUser = async ({ id, password, headers }) => {
  const response = await fetch(`${API_URL}${RESET_PWD_ENDPOINT}`, {
    method: METHOD_PATCH,
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ id, password }),
  })
  return handleAPIResponse2(response)
}
