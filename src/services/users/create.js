import knex from "../../knex/knex"
import { STATUS_401_UNAUTHORIZED } from "../../utils/http"
import { SUPER_ADMIN } from "../../utils/roles"
import { APIError } from "../../utils/errors"
import { untransform, validate } from "../../models/users"

export const create = async (user, currentUser) => {
   await validate(user)

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

   const [newId] = await knex("users").insert(untransform(user), "id")

   return newId
}
