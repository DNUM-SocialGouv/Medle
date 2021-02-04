import Cors from "micro-cors"

import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { reset } from "../../services/users/reset"
import { checkValidUserWithPrivilege } from "../../utils/auth"
import { METHOD_OPTIONS, METHOD_PATCH, STATUS_200_OK } from "../../utils/http"
import { logDebug } from "../../utils/logger"
import { ADMIN } from "../../utils/roles"

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
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    return sendAPIError(error, res)
  }
}
const cors = Cors({
  allowMethods: [METHOD_OPTIONS, METHOD_PATCH],
})

export default cors(handler)
