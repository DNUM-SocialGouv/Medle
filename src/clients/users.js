import fetch from "isomorphic-unfetch"

import { API_URL, FORGOT_PWD_ENDPOINT, RESET_PWD_ENDPOINT, USERS_ENDPOINT } from "../config"
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
    body: JSON.stringify(user),
    headers: { ...headers, "Content-Type": "application/json" },
    method: METHOD_POST,
  })
  return handleAPIResponse2(response)
}

export const updateUser = async ({ user, headers }) => {
  const response = await fetch(`${API_URL}${USERS_ENDPOINT}/${user.id}`, {
    body: JSON.stringify(user),
    headers: { ...headers, "Content-Type": "application/json" },
    method: METHOD_PUT,
  })
  return handleAPIResponse2(response)
}

export const deleteUser = async ({ id, headers }) => {
  const response = await fetch(`${API_URL}${USERS_ENDPOINT}/${id}`, { headers, method: METHOD_DELETE })
  return handleAPIResponse2(response)
}

/**
 * Reset password of a user by an admin.
 *
 * @param {Object} payload             - Inputs of the clients.
 * @param {number} payload.id          - User id to change password.
 * @param {string} payload.password    - New password to apply.
 * @param {Object} payload.headers     - Headers including authorization token.
 */
export const resetPasswordByAdmin = async ({ id, password, headers }) => {
  const response = await fetch(`${API_URL}${RESET_PWD_ENDPOINT}`, {
    body: JSON.stringify({ id, password }),
    headers: { ...headers, "Content-Type": "application/json" },
    method: METHOD_PATCH,
  })
  return handleAPIResponse2(response)
}

/**
 * Reset a user's password by himself.
 *
 * @param {Object} payload             - Inputs of the clients.
 * @param {string} payload.password    - New password to apply.
 * @param {number} payload.loginToken  - Authentification token to verify the identity of the user.
 */
export const resetPassword = async ({ loginToken, password }) => {
  const response = await fetch(`${API_URL}${RESET_PWD_ENDPOINT}`, {
    body: JSON.stringify({ loginToken, password }),
    headers: { "Content-Type": "application/json" },
    method: METHOD_PATCH,
  })
  return handleAPIResponse2(response)
}

/**
 * Send an email in case of forgetting the password.
 *
 * @param {string} email - Email to send the magic link.
 */
export const forgotPassword = async (email) => {
  const response = await fetch(`${API_URL}${FORGOT_PWD_ENDPOINT}`, {
    body: JSON.stringify({ email }),
    headers: { "Content-Type": "application/json" },
    method: METHOD_POST,
  })
  return handleAPIResponse2(response)
}

/**
 * Send an email to user in case of reset the password by admin.
 *
 * @param {integer} id - id of user to send magic link.
 */
 export const resetUserPasswordByAdmin = async (id) => {
  const response = await fetch(`${API_URL}${RESET_PWD_ENDPOINT}`, {
    body: JSON.stringify({ id }),
    headers: { "Content-Type": "application/json" },
    method: METHOD_POST,
  })
  return handleAPIResponse2(response)
}
