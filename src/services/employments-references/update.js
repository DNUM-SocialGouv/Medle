import knex from "../../knex/knex"
import { untransform, validate } from "../../models/employments-references"
import { isEmployementValid } from "../../utils/employments"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"

export const update = async ({ hid, rid }, data) => {
  // Check if query and body are consistent
  if (
    !rid ||
    isNaN(rid) ||
    !hid ||
    isNaN(hid) ||
    !data ||
    parseInt(rid, 10) !== parseInt(data.id, 10) ||
    parseInt(hid, 10) !== parseInt(data.hospitalId, 10)
  ) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  await validate(data)

  const { ides, others, doctors, nursings, executives, secretaries, auditoriumAgents } = data

  if (
    !isEmployementValid(ides) ||
    !isEmployementValid(others) ||
    !isEmployementValid(doctors) ||
    !isEmployementValid(nursings) ||
    !isEmployementValid(executives) ||
    !isEmployementValid(secretaries) ||
    !isEmployementValid(auditoriumAgents)
  ) {
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })
  }

  const { id } = data

  const number = await knex("employments_references").update(untransform(data)).where("id", id)

  return number
}
