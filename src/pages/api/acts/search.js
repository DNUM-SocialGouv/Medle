import { STATUS_200_OK, STATUS_500_INTERNAL_SERVER_ERROR, METHOD_GET } from "../../../utils/http"
import knex from "../../../knex/knex"
import { ACT_CONSULTATION } from "../../../utils/roles"
import { checkValidUserWithPrivilege, checkHttpMethod, sendAPIError } from "../../../utils/api"
import { APIError } from "../../../utils/errors"

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // 1 methods verification
      checkHttpMethod([METHOD_GET], req, res)

      // 2 privilege verification
      const currentUser = checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

      let scope = currentUser.scope || []
      scope = [...scope, currentUser.hospitalId]

      const { fuzzy, internalNumber, pvNumber } = req.query

      try {
         // 3 SQL query
         const acts = await knex("acts")
            .whereNull("acts.deleted_at")
            .where(builder => {
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
            })
            .orderBy([{ column: "acts.created_at", order: "desc" }])
            .select("*")

         return res.status(STATUS_200_OK).json(acts)
      } catch (error) {
         // 4 DB error
         throw new APIError({
            status: STATUS_500_INTERNAL_SERVER_ERROR,
            message: "Erreur DB",
            detailMessage: error,
            uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
         })
      }
   } catch (error) {
      console.error("API error", JSON.stringify(error))

      sendAPIError(error, res)
   }
}
