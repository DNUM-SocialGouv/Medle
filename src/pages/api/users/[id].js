import Cors from "micro-cors"

import { sendAPIError, sendMethodNotAllowedError, sendNotFoundError } from "../../../services/errorHelpers"
import { del, find, update } from "../../../services/users"
import { checkIsSuperAdmin, checkValidUserWithPrivilege } from "../../../utils/auth"
import { METHOD_DELETE, METHOD_GET, METHOD_OPTIONS, METHOD_PUT, STATUS_200_OK, CORS_ALLOW_ORIGIN } from "../../../utils/http"
import { ADMIN } from "../../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    switch (req.method) {
      case METHOD_GET: {
        const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

        checkIsSuperAdmin(currentUser)

        const user = await find({ ...req.query, currentUser })

        if (!user) return sendNotFoundError(res)

        return res.status(STATUS_200_OK).json(user)
      }
      case METHOD_DELETE: {
        const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

        checkIsSuperAdmin(currentUser)

        const deleted = await del({ ...req.query, currentUser })

        if (!deleted) return sendNotFoundError(res)

        return res.status(STATUS_200_OK).json({ deleted })
      }
      case METHOD_PUT: {
        const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

        checkIsSuperAdmin(currentUser)

        const updated = await update(req.query, req.body, currentUser)

        if (!updated) return sendNotFoundError(res)

        return res.status(STATUS_200_OK).json({ updated })
      }
      default:
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    return sendAPIError(error, res)
  }
}

const cors = Cors({
  allowMethods: [METHOD_DELETE, METHOD_GET, METHOD_OPTIONS, METHOD_PUT],
})

export default cors(handler)
