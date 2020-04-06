import Cors from "micro-cors"

import knex from "../../../knex/knex"
import { STATUS_200_OK, STATUS_400_BAD_REQUEST, METHOD_GET, METHOD_OPTIONS } from "../../../utils/http"
import { NO_PRIVILEGE_REQUIRED } from "../../../utils/roles"
import { sendAPIError, sendMethodNotAllowedError, sendNotFoundError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      switch (req.method) {
         case METHOD_GET: {
            checkValidUserWithPrivilege(NO_PRIVILEGE_REQUIRED, req, res)
            const { id } = req.body

            if (!id || isNaN(id)) {
               return res.status(STATUS_400_BAD_REQUEST).end()
            }

            const [hospital] = await knex("hospitals").where("id", id)

            if (hospital) {
               return res.status(STATUS_200_OK).json(hospital)
            } else {
               return sendNotFoundError(res)
            }
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
