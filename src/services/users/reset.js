import knex from "../../knex/knex"
import { hashPassword } from "../../utils/bcrypt"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"

export const reset = async (id, password) => {
  if (!id || isNaN(id)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  password = await hashPassword(password)

  const modified = await knex("users").where("id", id).whereNull("users.deleted_at").update({
    password,
  })

  return modified
}
