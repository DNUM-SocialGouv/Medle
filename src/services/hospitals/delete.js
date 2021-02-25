import knex from "../../knex/knex"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"

export const del = async ({ hid }) => {
  if (!hid || isNaN(hid)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  const number = await knex("hospitals").where("id", hid).whereNull("deleted_at").update({ deleted_at: knex.fn.now() })

  return number
}
