import knex from "../../knex/knex"
import { transformAll } from "../../models/users"
import { makeWhereClause } from "./common"
import { buildScope } from "../scope"

const LIMIT = 100

export const search = async ({ fuzzy, requestedPage, currentUser }) => {
   const scope = buildScope(currentUser)

   requestedPage = requestedPage && !isNaN(requestedPage) && parseInt(requestedPage, 10)

   const [usersCount] = await knex("users")
      .where(makeWhereClause({ scope, fuzzy }))
      .count()

   const totalCount = parseInt(usersCount.count)
   const maxPage = Math.ceil(totalCount / LIMIT)

   // set default to 1 if not correct or too little, set default to maxPage if too big
   const currentPage =
      !requestedPage || isNaN(requestedPage) || requestedPage < 1
         ? 1
         : requestedPage > maxPage
         ? maxPage
         : requestedPage

   const offset = (currentPage - 1) * LIMIT

   // SQL query
   const users = await knex("users")
      .leftJoin("hospitals", "users.hospital_id", "hospitals.id")
      .where(makeWhereClause({ scope, fuzzy }))
      .orderBy("users.created_at", "desc")
      .limit(LIMIT)
      .offset(offset)
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

   return { users: users && users.length ? transformAll(users) : [], totalCount, currentPage, maxPage, byPage: LIMIT }
}
