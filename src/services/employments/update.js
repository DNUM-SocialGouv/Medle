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

  let { ides, others, doctors, nursings, executives, secretaries, auditoriumAgents } = data

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

  const dataEmployements = {
    ides: employements[0],
    others: employements[1],
    doctors: employements[2],
    nursings: employements[3],
    executives: employements[4],
    secretaries: employements[5],
    auditoriumAgents: employements[6],
  }

  const result = await upsert({
    db: knex,
    key: ["hospital_id", "year", "month"],
    object: {
      data_month: dataEmployements,
      hospital_id: hospitalId,
      month,
      year,
    },
    table: "employments",
  })
  return result
}
