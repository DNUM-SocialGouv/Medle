import upsert from "knex-upsert"

import knex from "../../knex/knex"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"
import { isValid } from "./common"

export const update = async ({ year, month, hospitalId, data }) => {
  if (!isValid({ hospitalId, month, year }) || !data)
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })

  const result = await upsert({
    db: knex,
    key: ["hospital_id", "year", "month"],
    object: {
      data_month: data,
      hospital_id: hospitalId,
      month,
      year,
    },
    table: "employments",
  })

  return result
}
