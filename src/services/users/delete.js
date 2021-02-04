import knex from "../../knex/knex"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST, STATUS_401_UNAUTHORIZED, STATUS_404_NOT_FOUND } from "../../utils/http"
import { ADMIN_HOSPITAL } from "../../utils/roles"

const makeWhereClause = (currentUser) => (builder) => {
  if (!currentUser) {
    throw new APIError({
      status: STATUS_401_UNAUTHORIZED,
      message: "Not authorized",
    })
  }

  // ADMIN_HOSPITAL can only delete user of his own hospital
  if (currentUser.role === ADMIN_HOSPITAL) {
    builder.where("hospital_id", currentUser.hospitalId)
  }
}

export const del = async ({ id, currentUser }) => {
  if (!id || isNaN(id)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  const [user] = await knex("users").where("id", id).where(makeWhereClause(currentUser)).whereNull("deleted_at")

  if (!user) {
    throw new APIError({
      status: STATUS_404_NOT_FOUND,
      message: "Not found",
    })
  }

  const number = await knex("users").where("id", id).whereNull("deleted_at").update({ deleted_at: knex.fn.now() })

  return number
}
