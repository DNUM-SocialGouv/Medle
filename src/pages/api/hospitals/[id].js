import Cors from "micro-cors"

import { STATUS_200_OK, METHOD_DELETE, METHOD_GET, METHOD_OPTIONS, METHOD_PUT } from "../../../utils/http"
import { ADMIN, NO_PRIVILEGE_REQUIRED } from "../../../utils/roles"
import { sendAPIError, sendMethodNotAllowedError, sendNotFoundError } from "../../../services/errorHelpers"
import { checkIsSuperAdmin, checkValidUserWithPrivilege } from "../../../utils/auth"
import { del, find, update } from "../../../services/hospitals"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")

  try {
    switch (req.method) {
      case METHOD_GET: {
        checkValidUserWithPrivilege(NO_PRIVILEGE_REQUIRED, req, res)

        const hospital = await find(req.query)

        return hospital ? res.status(STATUS_200_OK).json(hospital) : sendNotFoundError(res)
      }
      case METHOD_DELETE: {
        const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

        checkIsSuperAdmin(currentUser)

        const deleted = await del(req.query, currentUser)

        if (!deleted) return sendNotFoundError(res)

        return res.status(STATUS_200_OK).json({ deleted })
      }
      case METHOD_PUT: {
        const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

        checkIsSuperAdmin(currentUser)

        const updated = await update(req.query, req.body)

        if (!updated) return sendNotFoundError(res)

        return res.status(STATUS_200_OK).json({ updated })
      }

      default:
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    sendAPIError(error, res)
  }
}

const cors = Cors({
  allowMethods: [METHOD_GET, METHOD_OPTIONS],
})

export default cors(handler)
