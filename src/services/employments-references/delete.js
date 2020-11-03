import knex from "../../knex/knex"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"
import { APIError } from "../../utils/errors"

export const del = async ({ hid, rid }) => {
  // Check if query and body are consistent
  if (!rid || isNaN(rid) || !hid || isNaN(hid)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  const number = await knex("employments_references").where("id", rid).del()

  return number
}
