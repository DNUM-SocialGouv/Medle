import knex from "../../knex/knex"
import { STATUS_400_BAD_REQUEST, STATUS_401_UNAUTHORIZED } from "../../utils/http"
import { SUPER_ADMIN } from "../../utils/roles"
import { APIError } from "../../utils/errors"
import { untransform, validate } from "../../models/users"

export const update = async ({ id }, user, currentUser) => {
   if (!id || isNaN(id) || !user || parseInt(id, 10) !== parseInt(user.id, 10)) {
      throw new APIError({
         status: STATUS_400_BAD_REQUEST,
         message: "Bad request",
      })
   }

   user = await validate(user)

   if (currentUser.role !== SUPER_ADMIN) {
      if (!user.hospital || !user.hospital.id || !currentUser.hospital || !currentUser.hospital.id)
         throw new APIError({
            status: STATUS_401_UNAUTHORIZED,
            message: "Not authorized",
         })

      if (user.hospital.id !== currentUser.hospital.id) {
         throw new APIError({
            status: STATUS_401_UNAUTHORIZED,
            message: "Not authorized",
         })
      }
   }

   const number = await knex("users")
      .update(untransform(user))
      .where("id", id)

   return number
}
