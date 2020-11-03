import knex from "../../knex/knex"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"
import { transformAll } from "../../models/employments-references"

export const findAll = async ({ hid }) => {
  if (!hid)
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })

  const results = await knex("employments_references")
    .whereNull("deleted_at")
    .where("hospital_id", hid)
    .orderBy([
      { column: "year", order: "desc" },
      { column: "month", order: "desc" },
    ])
    .select("id", "year", "month", "hospital_id", "reference")

  return results ? transformAll(results) : []
}
