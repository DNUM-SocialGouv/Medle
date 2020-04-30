import knex from "../../knex/knex"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"
import { APIError } from "../../utils/errors"
import { transform } from "../../models/hospitals"

export const find = async ({ id }) => {
  if (!id || isNaN(id)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  const [hospital] = await knex("hospitals").where("id", id)

  return transform(hospital)
}
