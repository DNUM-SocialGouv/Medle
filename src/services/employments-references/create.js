import knex from "../../knex/knex"
import { untransform, validate } from "../../models/employments-references"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST, STATUS_403_FORBIDDEN } from "../../utils/http"
import { isETPValid } from "./common"

export const create = async (data) => {
  await validate(data)

  const { ides, others, doctors, nursings, executives, secretaries, auditoriumAgents } = data

  if (
    !isETPValid(ides) ||
    !isETPValid(others) ||
    !isETPValid(doctors) ||
    !isETPValid(nursings) ||
    !isETPValid(executives) ||
    !isETPValid(secretaries) ||
    !isETPValid(auditoriumAgents)
  ) {
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })
  }

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
