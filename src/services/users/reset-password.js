import knex from "../../knex/knex"
import { hashPassword } from "../../utils/bcrypt"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"

/**
 * Update the user's password based by id.
 *
 * @param {Object} payload               - Payload.
 * @param {number} payload.id            - User'id to whom change password.
 * @param {string} payload.password      - New password.
 *
 * @returns {Object} Modified user.
 */
export const resetFromId = async ({ id, password }) => {
  if (!id || isNaN(id)) {
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })
  }

  password = await hashPassword(password)

  const modified = await knex("users").where("id", id).whereNull("users.deleted_at").update({
    password,
  })

  return modified
}

/**
 * Update the user's password based by the email.
 *
 * @param {Object} payload               - Payload.
 * @param {number} payload.email         - User'email to whom change password.
 * @param {string} payload.password      - New password.
 *
 * @returns {Object} Modified user.
 */
export const resetFromEmail = async ({ email, password }) => {
  if (!email) {
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })
  }

  password = await hashPassword(password)

  const modified = await knex("users").where("email", email).whereNull("users.deleted_at").update({
    password,
    reset_password: false
  })

  return modified
}
