import knex from "../../knex/knex"
import { transform } from "../../models/employments-references"
import { isMonthValid, isYearValid } from "../../utils/employments"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"

export const searchByMonth = async ({ hid }, { year, month }) => {
  if (!hid || !year || isNaN(year) || !month || isNaN(month) || !isYearValid(year) || !isMonthValid(month))
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })

  const [reference] = await knex("employments_references")
    .whereNull("deleted_at")
    .where("hospital_id", hid)
    .whereRaw("year || month  <= ?", new String(year) + month)
    .orderBy([
      { column: "year", order: "desc" },
      { column: "month", order: "desc" },
    ])
    .select("id", "year", "month", "hospital_id", "reference")

  return reference ? transform(reference) : []
}
