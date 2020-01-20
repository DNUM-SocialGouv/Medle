import { STATUS_200_OK, METHOD_GET } from "../../../utils/http"
import knex from "../../../knex/knex"
import { ACT_CONSULTATION } from "../../../utils/roles"
import { checkValidUserWithPrivilege, checkHttpMethod, sendAPIError } from "../../../utils/api"

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // 1 methods verification
      checkHttpMethod([METHOD_GET], req, res)

      // 2 privilege verification
      checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

      // 3 SQL query
      const attacks = await knex("attacks")
         .whereNull("deleted_at")
         .orderBy("name")
         .select("id", "name")

      return res.status(STATUS_200_OK).json(attacks)
   } catch (error) {
      // 4 DB error
      console.error(error)
      console.error("API error", JSON.stringify(error))
      sendAPIError(error, res)
   }
}
