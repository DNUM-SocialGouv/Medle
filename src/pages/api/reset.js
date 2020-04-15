import Cors from "micro-cors"

import { STATUS_200_OK, METHOD_OPTIONS, METHOD_PATCH } from "../../utils/http"
import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { reset } from "../../services/users/reset"
import { checkValidUserWithPrivilege } from "../../utils/auth"
import { ADMIN } from "../../utils/roles"
import { logDebug } from "../../utils/logger"

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      switch (req.method) {
         case METHOD_PATCH: {
            const { id, password } = req.body

            const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

            logDebug("Password reset by user ", currentUser)

            const modified = await reset(id, password)

            return res.status(STATUS_200_OK).json({ modified })
         }
         default:
            return sendMethodNotAllowedError(res)
      }
   } catch (error) {
      return sendAPIError(error, res)
   }
}
const cors = Cors({
   allowMethods: [METHOD_OPTIONS, METHOD_PATCH],
})

export default cors(handler)
