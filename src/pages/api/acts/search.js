import Cors from "micro-cors"

import { STATUS_200_OK, STATUS_500_INTERNAL_SERVER_ERROR, METHOD_GET, METHOD_OPTIONS } from "../../../utils/http"
import knex from "../../../knex/knex"
import { ACT_CONSULTATION } from "../../../utils/roles"
import { sendAPIError } from "../../../utils/api"
import { checkValidUserWithPrivilege } from "../../../utils/auth"
import { APIError } from "../../../utils/errors"

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

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // privilege verification
      const currentUser = checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

      let scope = currentUser.scope || []
      scope = [...scope, currentUser.hospitalId]

      const { fuzzy, internalNumber, pvNumber } = req.query

      let requestedPage =
         req.query.requestedPage && !isNaN(req.query.requestedPage) && parseInt(req.query.requestedPage)

      try {
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
            .orderBy([{ column: "acts.created_at", order: "desc" }])
            .limit(LIMIT)
            .offset(offset)
            .select("*")

         return res.status(STATUS_200_OK).json({ totalCount, currentPage: requestedPage, maxPage, byPage: LIMIT, acts })
      } catch (error) {
         throw new APIError({
            status: STATUS_500_INTERNAL_SERVER_ERROR,
            message: "Erreur DB",
            detailMessage: error.message,
            uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
         })
      }
   } catch (error) {
      // DB error
      sendAPIError(error, res)
   }
}

const cors = Cors({
   allowMethods: [METHOD_GET, METHOD_OPTIONS],
})

export default cors(handler)
