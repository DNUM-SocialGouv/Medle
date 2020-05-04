import knex from "../../knex/knex"
import { untransform, validate } from "../../models/askers"
import { STATUS_403_FORBIDDEN } from "../../utils/http"
import { APIError } from "../../utils/errors"

export const create = async (asker) => {
  await validate(asker)

  const [otherAsker] = await knex("askers")
    .whereNull("deleted_at")
    .where("name", asker.name)
    .where("dep_code", asker.depCode)

  if (otherAsker)
    throw new APIError({
      status: STATUS_403_FORBIDDEN,
      message: "Asker already present",
    })

  const [newId] = await knex("askers").insert(untransform(asker), "id")

  return newId
}
