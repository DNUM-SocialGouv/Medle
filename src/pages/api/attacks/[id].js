import Cors from "micro-cors"

import { del, find, update } from "../../../services/attacks"
import { sendAPIError, sendMethodNotAllowedError, sendNotFoundError } from "../../../services/errorHelpers"
import { checkIsSuperAdmin, checkValidUserWithPrivilege } from "../../../utils/auth"
import { METHOD_DELETE, METHOD_GET, METHOD_OPTIONS, METHOD_PUT, STATUS_200_OK } from "../../../utils/http"
import { ACT_CONSULTATION, ADMIN } from "../../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")

  try {
    switch (req.method) {
      case METHOD_GET: {
        checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

        const attack = await find(req.query)

        if (attack) return res.status(STATUS_200_OK).json(attack)

        return sendNotFoundError(res)
      }
      case METHOD_DELETE: {
        const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

        checkIsSuperAdmin(currentUser)

        const deleted = await del(req.query)

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
  allowMethods: [METHOD_GET, METHOD_PUT, METHOD_DELETE, METHOD_OPTIONS],
})

export default cors(handler)
