import knex from "../../knex/knex"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"
import { isValid } from "./common"

export const find = async ({ year, month, hospitalId }) => {
  if (!isValid({ year, month, hospitalId }))
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })

  const [results] = await knex("employments")
    .whereNull("deleted_at")
    .where("year", year)
    .where("month", month)
    .where("hospital_id", hospitalId)
    .select("data_month")

  return (results && results.data_month) || {}
}
