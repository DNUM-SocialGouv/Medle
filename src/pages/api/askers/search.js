import { STATUS_200_OK, METHOD_GET } from "../../../utils/http"
import knex from "../../../knex/knex"
import { ACT_MANAGEMENT } from "../../../utils/roles"
import { checkValidUserWithPrivilege, checkHttpMethod, sendAPIError } from "../../../utils/api"

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // 1 methods verification
      checkHttpMethod([METHOD_GET], req, res)

      // 2 privilege verification
      checkValidUserWithPrivilege(ACT_MANAGEMENT, req, res)

      const { fuzzy, all } = req.query

      // 3 SQL query
      const askers = await knex("askers")
         .whereNull("deleted_at")
         .where(builder => {
            if (fuzzy) {
               builder.where("name", "ilike", `%${fuzzy}%`)
            }
            if (!all) {
               builder.limit(5)
            }
         })
         .orderBy("name")
         .select("id", "name")

      return res.status(STATUS_200_OK).json(askers)
   } catch (error) {
      // 4 DB error
      console.error(error)
      console.error("API error", JSON.stringify(error))
      sendAPIError(error, res)
   }
}
