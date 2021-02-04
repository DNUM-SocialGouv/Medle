import knex from "../../knex/knex"
import { untransform, validate } from "../../models/employments-references"
import { APIError } from "../../utils/errors"
import { STATUS_403_FORBIDDEN } from "../../utils/http"

export const create = async (data) => {
  await validate(data)

  const { hospitalId, year, month } = data

  const [otherReference] = await knex("employments_references")
    .whereNull("deleted_at")
    .where("hospital_id", hospitalId)
    .where("year", year)
    .where("month", month)

  if (otherReference)
    throw new APIError({
      status: STATUS_403_FORBIDDEN,
      message: "Il existe déjà des ETP de référence pour ce mois.",
    })

  const [newId] = await knex("employments_references").insert(untransform(data), "id")

  return newId
}
