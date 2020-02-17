import Cors from "micro-cors"

import { STATUS_200_OK, METHOD_GET, METHOD_OPTIONS } from "../../../utils/http"
import knex from "../../../knex/knex"
import { ACT_MANAGEMENT } from "../../../utils/roles"
import { checkValidUserWithPrivilege, sendAPIError } from "../../../utils/api"

const MAX_VALUE = 100000

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // privilege verification
      checkValidUserWithPrivilege(ACT_MANAGEMENT, req, res)

      const { fuzzy, all } = req.query

      // SQL query
      const askers = await knex("askers")
         .whereNull("deleted_at")
         .where(builder => {
            if (fuzzy) {
               builder.where("name", "ilike", `%${fuzzy}%`)
            }
         })
         .limit(all ? MAX_VALUE : 10)
         .orderBy("name")
         .select("id as value", "name as label")

      return res.status(STATUS_200_OK).json(askers)
   } catch (error) {
      // DB error
      sendAPIError(error, res)
   }
}

const cors = Cors({
   allowMethods: [METHOD_GET, METHOD_OPTIONS],
})

export default cors(handler)
