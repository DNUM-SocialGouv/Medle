import upsert from "knex-upsert"

import knex from "../../knex/knex"
import { isEmployementValid, isMonthValid, isValid, isYearValid } from "../../utils/employments"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"

export const update = async ({ year, month, hospitalId, data }) => {
  if (!isValid({ hospitalId, month, year }) || !data || !isYearValid(year) || !isMonthValid(month))
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })

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

  const result = await upsert({
    db: knex,
    key: ["hospital_id", "year", "month"],
    object: {
      data_month: { ides, others, doctors, nursings, executives, secretaries, auditoriumAgents },
      hospital_id: hospitalId,
      month,
      year,
    },
    table: "employments",
  })
  return result
}
