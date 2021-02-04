import knex from "../../knex/knex"
import { transform, transformAll } from "../../models/hospitals"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"

export const find = async ({ hid }) => {
  if (!hid || isNaN(hid)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  const [hospital] = await knex("hospitals").where("id", hid)

  return transform(hospital)
}

export const findList = async (arr) => {
  if (!arr?.length) {
    return []
  }

  const hospitals = await knex("hospitals").whereIn("id", arr)

  return transformAll(hospitals)
}
