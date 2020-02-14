import Cors from "micro-cors"

import { STATUS_200_OK, METHOD_GET, METHOD_OPTIONS } from "../../../utils/http"
import knex from "../../../knex/knex"
import { ACT_CONSULTATION } from "../../../utils/roles"
import { checkValidUserWithPrivilege, sendAPIError } from "../../../utils/api"

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // privilege verification
      checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

      // SQL query
      const attacks = await knex("attacks")
         .whereNull("deleted_at")
         .orderBy("name")
         .select("id", "name")

      return res.status(STATUS_200_OK).json(attacks)
   } catch (error) {
      // DB error
      sendAPIError(error, res)
   }
}

const cors = Cors({
   allowMethods: [METHOD_GET, METHOD_OPTIONS],
})

export default cors(handler)
