import Cors from "micro-cors"

import knex from "../../../knex/knex"
import { STATUS_200_OK, METHOD_GET, METHOD_OPTIONS } from "../../../utils/http"
import { NO_PRIVILEGE_REQUIRED } from "../../../utils/roles"
import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"

const MAX_VALUE = 100000

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      switch (req.method) {
         case METHOD_GET: {
            checkValidUserWithPrivilege(NO_PRIVILEGE_REQUIRED, req, res)

            const { fuzzy, all } = req.query

            const hospitals = await knex("hospitals")
               .whereNull("deleted_at")
               .where(builder => {
                  if (fuzzy) {
                     builder.where("name", "ilike", `%${fuzzy}%`)
                  }
               })
               .limit(all ? MAX_VALUE : 10)
               .orderBy("name")
               .select("id as value", "name as label")

            return res.status(STATUS_200_OK).json(hospitals)
         }
         default:
            return sendMethodNotAllowedError(res)
      }
   } catch (error) {
      sendAPIError(error, res)
   }
}

const cors = Cors({
   allowMethods: [METHOD_GET, METHOD_OPTIONS],
})

export default cors(handler)
