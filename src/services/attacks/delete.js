import knex from "../../knex/knex"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"

export const del = async ({ id }) => {
  if (!id || isNaN(id)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  const number = await knex("attacks").where("id", id).whereNull("deleted_at").update({ deleted_at: knex.fn.now() })

  return number
}
