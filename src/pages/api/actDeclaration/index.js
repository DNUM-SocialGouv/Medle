import Cors from "micro-cors"

import { STATUS_200_OK, STATUS_400_BAD_REQUEST, METHOD_POST, METHOD_OPTIONS } from "../../../utils/http"
import knex from "../../../knex/knex"
import { buildActFromJSON } from "../../../knex/models/acts"
import { ACT_MANAGEMENT } from "../../../utils/roles"
import { sendAPIError } from "../../../utils/api"
import { checkValidUserWithPrivilege } from "../../../utils/auth"
import { logError } from "../../../utils/logger"

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // privilege verification
      const currentUser = checkValidUserWithPrivilege(ACT_MANAGEMENT, req, res)

      // request verification
      const data = await req.body

      if (!data || !data.hospitalId) {
         logError(`Bad request ${STATUS_400_BAD_REQUEST} (${currentUser.email ? currentUser.email : "unknown user"})`)
         return res.status(STATUS_400_BAD_REQUEST).json({ message: "Bad request" })
      }

      // SQL query
      const ids = await knex("acts").insert(buildActFromJSON(data), "id")

      return res.status(STATUS_200_OK).json({ message: `Déclaration envoyée`, detail: ids[0] })
   } catch (error) {
      // DB error
      sendAPIError(error, res)
   }
}

const cors = Cors({
   allowMethods: [METHOD_POST, METHOD_OPTIONS],
})

export default cors(handler)
