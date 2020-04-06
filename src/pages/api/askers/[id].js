import Cors from "micro-cors"

import knex from "../../../knex/knex"
import { STATUS_200_OK, METHOD_GET, METHOD_OPTIONS } from "../../../utils/http"
import { ACT_MANAGEMENT } from "../../../utils/roles"
import {
   sendAPIError,
   sendBadRequestError,
   sendMethodNotAllowedError,
   sendNotFoundError,
} from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      switch (req.method) {
         case METHOD_GET: {
            checkValidUserWithPrivilege(ACT_MANAGEMENT, req, res)

            const { id } = req.query
            if (!id || isNaN(id)) {
               return sendBadRequestError(res)
            }

            const [askers] = await knex("askers").where("id", id)

            if (askers) return res.status(STATUS_200_OK).json(askers)

            return sendNotFoundError(res)
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
