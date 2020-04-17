import knex from "../../knex/knex"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"
import { APIError } from "../../utils/errors"
import { untransform, validate } from "../../models/hospitals"

export const update = async ({ id }, hospital) => {
   if (!id || isNaN(id) || !hospital || parseInt(id, 10) !== parseInt(hospital.id, 10)) {
      throw new APIError({
         status: STATUS_400_BAD_REQUEST,
         message: "Bad request",
      })
   }

   hospital = await validate(hospital)

   const number = await knex("hospitals")
      .update(untransform(hospital))
      .where("id", id)

   return number
}
