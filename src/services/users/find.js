import knex from "../../knex/knex"
import { STATUS_400_BAD_REQUEST } from "../../utils/http"
import { APIError } from "../../utils/errors"
import { transform } from "../../models/users"
import { makeWhereClause } from "./common"
import { buildScope } from "../scope"

export const find = async ({ id, currentUser }) => {
   if (!id || isNaN(id)) {
      throw new APIError({
         status: STATUS_400_BAD_REQUEST,
         message: "Bad request",
      })
   }

   const scope = buildScope(currentUser)

   let [user] = await knex("users")
      .leftJoin("hospitals", "users.hospital_id", "hospitals.id")
      .where("users.id", id)
      .where(makeWhereClause({ scope }))
      .select(
         "users.id",
         "users.first_name",
         "users.last_name",
         "users.email",
         "users.password",
         "users.role",
         "users.hospital_id",
         "hospitals.name as hospital_name",
         "users.scope",
      )

   user = transform(user)

   if (user && user.scope && user.scope.length) {
      const userScope = await knex("hospitals")
         .whereNull("deleted_at")
         .whereIn("id", user.scope)
         .select("id", "name")

      user = { ...user, scope: userScope }
   }

   return user
}
