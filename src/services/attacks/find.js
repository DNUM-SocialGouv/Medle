import knex from "../../knex/knex"
import { transform } from "../../models/attacks"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"

export const find = async ({ id }) => {
  if (!id || isNaN(id)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  const [attack] = await knex("attacks").where("id", id)

  return transform(attack)
}
