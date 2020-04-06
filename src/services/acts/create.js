import knex from "../../knex/knex"
import { STATUS_400_BAD_REQUEST, STATUS_401_UNAUTHORIZED } from "../../utils/http"
import { APIError } from "../../utils/errors"

import { untransform } from "../../models/acts"

export const create = async (data, currentUser) => {
   if (!data || !data.hospitalId) {
      throw new APIError({
         status: STATUS_400_BAD_REQUEST,
         message: "Bad request",
      })
   }

   if (data.hospitalId !== (currentUser.hospital && currentUser.hospital.id)) {
      throw new APIError({
         status: STATUS_401_UNAUTHORIZED,
         message: "Not authorized",
      })
   }

   const [id] = await knex("acts").insert(untransform(data), "id")

   return id
}
