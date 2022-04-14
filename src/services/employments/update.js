import upsert from "knex-upsert"

import knex from "../../knex/knex"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"
import { isETPValid, isMonthValid, isValid, isYearValid } from "./common"

export const update = async ({ year, month, hospitalId, data }) => {
  if (!isValid({ hospitalId, month, year }) || !data)
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })

  const { ides, others, doctors, nursings, executives, secretaries, auditoriumAgents } = data

  if (
    !isYearValid(year) ||
    !isMonthValid(month) ||
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
