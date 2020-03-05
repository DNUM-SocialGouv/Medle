import Cors from "micro-cors"

import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_403_FORBIDDEN,
   METHOD_POST,
   METHOD_OPTIONS,
} from "../../../utils/http"
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

      let scope = currentUser.scope || []
      scope = [...scope, currentUser.hospitalId]

      // request verification
      const { id } = req.query
      if (!id || isNaN(id)) {
         return res.status(STATUS_400_BAD_REQUEST).end()
      }

      const data = await req.body

      // scope verification
      if (!data || !data.hospitalId) {
         logError(`Bad request ${STATUS_400_BAD_REQUEST} (${currentUser.email ? currentUser.email : "unknown user"})`)
         return res.status(STATUS_400_BAD_REQUEST).json({ message: "Bad request" })
      }

      if (!scope || !scope.includes(data.hospitalId)) {
         logError(
            `Forbidden action for the user ${STATUS_403_FORBIDDEN} (${
               currentUser.email ? currentUser.email : "unknown user"
            })`,
         )
         return res.status(STATUS_403_FORBIDDEN).json({ message: "Forbidden action for the user" })
      }

      // SQL query
      await knex("acts")
         .update(buildActFromJSON(data))
         .where("id", id)

      return res.status(STATUS_200_OK).json({ message: `Acte ${id} modifié` })
   } catch (error) {
      // DB error
      sendAPIError(error, res)
   }
}
const cors = Cors({
   allowMethods: [METHOD_POST, METHOD_OPTIONS],
})

export default cors(handler)
