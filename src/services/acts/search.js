import knex from "../../knex/knex"
import { transformAll } from "../../models/acts"

const LIMIT = 100

const makeWhereClause = ({ scope, internalNumber, pvNumber, fuzzy }) => builder => {
   builder.whereNull("acts.deleted_at")
   if (scope && scope.length) {
      builder.where(knex.raw("hospital_id in (" + scope.map(() => "?").join(",") + ")", [...scope]))
   }

   if (internalNumber) {
      builder.where("internal_number", internalNumber)
   }

   if (pvNumber) {
      builder.where("pv_number", pvNumber)
   }

   if (fuzzy) {
      builder.where(function() {
         this.where("internal_number", "ilike", `%${fuzzy}%`)
            .orWhere("pv_number", "ilike", `%${fuzzy}%`)
            .orWhere("profile", "ilike", `%${fuzzy}%`)
      })
   }
}

export const search = async ({ fuzzy, internalNumber, pvNumber, requestedPage }, currentUser) => {
   let scope = currentUser.scope || []
   if (currentUser.hospital && currentUser.hospital.id) scope = [...scope, currentUser.hospital.id]

   requestedPage = requestedPage && !isNaN(requestedPage) && parseInt(requestedPage)

   const [actsCount] = await knex("acts")
      .where(makeWhereClause({ scope, internalNumber, pvNumber, fuzzy }))
      .count()

   const totalCount = parseInt(actsCount.count)
   const maxPage = Math.ceil(totalCount / LIMIT)

   // set default to 1 if not correct or too little, set default to maxPage if too big
   requestedPage =
      !requestedPage || isNaN(requestedPage) || requestedPage < 1
         ? 1
         : requestedPage > maxPage
         ? maxPage
         : requestedPage

   const offset = (requestedPage - 1) * LIMIT

   // SQL query
   const acts = await knex("acts")
      .where(makeWhereClause({ scope, internalNumber, pvNumber, fuzzy }))
      .orderByRaw(
         "acts.examination_date desc, case when (acts.updated_at is not null) then acts.updated_at else acts.created_at end desc",
      )
      .limit(LIMIT)
      .offset(offset)
      .select("*")

   return { totalCount, currentPage: requestedPage, maxPage, byPage: LIMIT, elements: transformAll(acts) }
}
