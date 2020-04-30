import knex from "../../knex/knex"
import upsert from "knex-upsert"
import { isValid } from "./common"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"

export const update = async ({ year, month, hospitalId, data }) => {
  if (!isValid({ year, month, hospitalId }) || !data)
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })

  const result = await upsert({
    db: knex,
    table: "employments",
    object: {
      hospital_id: hospitalId,
      year,
      month,
      data_month: JSON.stringify(data),
    },
    key: ["hospital_id", "year", "month"],
  })

  return result
}
