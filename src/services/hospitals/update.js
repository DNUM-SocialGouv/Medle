import knex from "../../knex/knex"
import { untransform, validate } from "../../models/hospitals"
import { APIError } from "../../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"

export const update = async ({ hid }, hospital) => {

  if (!hid || isNaN(hid) || !hospital || parseInt(hid, 10) !== parseInt(hospital.id, 10)) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    })
  }

  hospital = await validate(hospital)

  const number = await knex("hospitals").update(untransform(hospital)).where("id", hid)

  return number
}
