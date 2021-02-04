import knex from "../../knex/knex"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST, STATUS_404_NOT_FOUND } from "../../utils/http"
import { buildScope } from "../scope"
import { makeWhereClause } from "./common"

export const del = async ({ id }, currentUser) => {
  if (!id || isNaN(id)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  const reachableScope = buildScope(currentUser)

  const [act] = await knex("acts").where("id", id).where(makeWhereClause(reachableScope)).whereNull("deleted_at")

  if (!act) {
    throw new APIError({
      status: STATUS_404_NOT_FOUND,
      message: "Not found",
    })
  }

  const number = await knex("acts").where("id", id).whereNull("deleted_at").update({ deleted_at: knex.fn.now() })

  return number
}
