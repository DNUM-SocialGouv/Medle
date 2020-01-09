import { STATUS_200_OK, STATUS_500_INTERNAL_SERVER_ERROR, METHOD_GET } from "../../../utils/http"
import knex from "../../../knex/knex"
import { ACT_CONSULTATION } from "../../../utils/roles"
import { checkValidUserWithPrivilege, checkHttpMethod } from "../../../utils/api"

export default async (req, res) => {
   const { scope: _scope } = req.cookies

   const scope = _scope ? JSON.parse(_scope) : []

   res.setHeader("Content-Type", "application/json")

   checkHttpMethod([METHOD_GET], req, res)

   checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

   const { fuzzy, internalNumber, pvNumber } = req.query

   let acts

   try {
      acts = await knex("acts")
         .whereNull("acts.deleted_at")
         .where(builder => {
            if (scope.length) {
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
      console.error(error)
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
         error: `Erreur serveur base de données`,
         message: error,
         uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
      })
   }
}
