import knex from "../../knex/knex"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"
import { APIError } from "../../utils/errors"
import { transform } from "../../models/askers"

export const find = async ({ id }) => {
   if (!id || isNaN(id)) {
      throw new APIError({
         status: STATUS_400_BAD_REQUEST,
         message: "Bad request",
      })
   }

   const [asker] = await knex("askers").where("id", id)

   return transform(asker)
}
