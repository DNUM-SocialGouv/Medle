import Cors from "micro-cors"

import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { resetFromEmail, resetFromId } from "../../services/users/reset-password"
import { checkValidUserWithPrivilege } from "../../utils/auth"
import { METHOD_OPTIONS, METHOD_PATCH, STATUS_200_OK, CORS_ALLOW_ORIGIN } from "../../utils/http"
import { checkToken } from "../../utils/jwt"
import { logDebug } from "../../utils/logger"
import { ADMIN } from "../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    switch (req.method) {
      case METHOD_PATCH: {
        const { id, lastPassword, password, loginToken } = req.body
        let modified

        // Usage by inputs id/password for admin.
        if (id) {
          const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)
          logDebug("Password reset by user ", currentUser)

          modified = await resetFromId({ id, lastPassword, password })
        } else {
          // Usage by inputs loginToken/password for user which wants to change its own password.
          const user = checkToken(loginToken)

          modified = await resetFromEmail({ email: user.email, password })
        }
        console.debug("Nb user modified " + modified)

        return res.status(STATUS_200_OK).json({})
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
