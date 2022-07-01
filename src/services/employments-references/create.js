import knex from "../../knex/knex"
import { untransform, validate } from "../../models/employments-references"
import { isEmployementValid, isMonthValid, isYearValid } from "../../utils/employments"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST, STATUS_403_FORBIDDEN } from "../../utils/http"

export const create = async (data) => {
  await validate(data)

  let { hospitalId, year, month, ides, others, doctors, nursings, executives, secretaries, auditoriumAgents } = data

  const employements = [ides, others, doctors, nursings, executives, secretaries, auditoriumAgents]

  let index = 0;
  for (let employement of employements) {
    if (employement && !isEmployementValid(employement)) {
      throw new APIError({
        message: "Bad request",
        status: STATUS_400_BAD_REQUEST,
      })
    }

    if (!employement) {
      employements[index] = 0
    }
    index++
  }

  if (
    !isYearValid(year) ||
    !isMonthValid(month)
  ) {
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })
  }

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
