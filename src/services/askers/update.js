import knex from "../../knex/knex"
import { STATUS_400_BAD_REQUEST, STATUS_403_FORBIDDEN } from "../../utils/http"
import { APIError } from "../../utils/errors"
import { untransform, validate } from "../../models/askers"

export const update = async ({ id }, asker) => {
  // Check if query and body are consistent
  if (!id || isNaN(id) || !asker || parseInt(id, 10) !== parseInt(asker.id, 10)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  asker = await validate(asker)

  const [otherAsker] = await knex("askers")
    .whereNull("deleted_at")
    .where("name", asker.name)
    .where("dep_code", asker.depCode)
    .whereNot("id", asker.id)

  if (otherAsker)
    throw new APIError({
      status: STATUS_403_FORBIDDEN,
      message: "Asker already present",
    })

  const number = await knex("askers").update(untransform(asker)).where("id", id)

  return number
}
