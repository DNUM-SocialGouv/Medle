import knex from "../../knex/knex"
import { extractMonthYear } from "../../utils/date"
import { isValid, isHospitalValid } from "../../utils/employments"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"

export const find = async ({ year, month, hospitalId }) => {
  if (!isValid({ hospitalId, month, year }))
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })

  const [results] = await knex("employments")
    .whereNull("deleted_at")
    .where("year", year)
    .where("month", month)
    .where("hospital_id", hospitalId)
    .select("data_month")

  return (results && results.data_month) || {}
}

export const findByHospitalId = async ({ hospitalId }) => {
  if (!isHospitalValid({ hospitalId }))
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })

    const results = await knex('employments')
    .select(
      'year',
      'month',
      knex.raw('SUM(CAST(data_month->>\'doctors\' AS NUMERIC) * 20) as total_doctors')
      )
    .groupBy('year', 'month')
    .then((result) => {
      const formattedResult = {};
  
      result.forEach((row) => {
        const { year, month, total_doctors } = row;
  
        if (!formattedResult[year]) {
          formattedResult[year] = {};
        }
  
        const monthName = (() => {
          const months = [
            'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
          ];
          return months[parseInt(month) - 1];
        })();
  
        formattedResult[year][monthName] = total_doctors;
      });
      return formattedResult
    })
  return results || {}
}

export const findLastEdit = async (hospitalId) => {
  if (isNaN(hospitalId) || Number(hospitalId) < 1) {
    throw new APIError({
      message: "Bad request",
      status: STATUS_400_BAD_REQUEST,
    })
  }

  const { year } = extractMonthYear()

  const previousYear = year - 1

  const [results] = await knex("employments")
    .where("hospital_id", hospitalId)
    .orderByRaw("year desc, month desc")
    .select(knex.raw("year, month, coalesce(updated_at, created_at) as lastupdated"))

  const [nbMonths] = await knex("employments")
    .whereNull("deleted_at")
    .where("year", previousYear)
    .where("hospital_id", hospitalId)
    .count()

  const nbMonthsPreviousYear = isNaN(nbMonths?.count) ? 0 : Number(nbMonths?.count)

  return { lastEdit: results, nbMonthsPreviousYear, previousYear } || {}
}
