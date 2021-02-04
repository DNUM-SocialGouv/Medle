import knex from "../../knex/knex"
import { transform } from "../../models/employments-references"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"

export const find = async (data = {}) => {
  const { hid, rid } = data

  if (!hid || !rid)
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })

  const [reference] = await knex("employments_references")
    .whereNull("deleted_at")
    .where("hospital_id", hid)
    .where("id", rid)
    .select("id", "year", "month", "hospital_id", "reference")

  return reference ? transform(reference) : {}
}
