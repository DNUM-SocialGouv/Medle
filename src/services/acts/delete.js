import knex from "../../knex/knex"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST, STATUS_404_NOT_FOUND } from "../../utils/http"
import { buildScope } from "../../utils/scope"
import { makeWhereClause } from "./common"

export const del = async ({ id }, currentUser) => {
  if (!id || isNaN(id)) {
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })
  }

  const reachableScope = buildScope(currentUser)

  const [act] = await knex("acts").where("id", id).where(makeWhereClause(reachableScope)).whereNull("deleted_at")

  if (!act) {
    throw new APIError({
      message: "Not found",
      status: STATUS_404_NOT_FOUND,
    })
  }

  const number = await knex("acts").where("id", id).whereNull("deleted_at").update({ deleted_at: knex.fn.now() })

  return number
}
