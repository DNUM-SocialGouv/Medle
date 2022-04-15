import Cors from "micro-cors"

import { sendAPIError, sendMethodNotAllowedError, sendNotFoundError } from "../../../../services/errorHelpers"
import { del, find, update } from "../../../../services/hospitals"
import { checkIsSuperAdmin, checkValidUserWithPrivilege } from "../../../../utils/auth"
import { METHOD_DELETE, METHOD_GET, METHOD_OPTIONS, METHOD_PUT, STATUS_200_OK } from "../../../../utils/http"
import { ADMIN } from "../../../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  const { hid } = req.query

  try {
    switch (req.method) {
      case METHOD_GET: {
        checkValidUserWithPrivilege(ADMIN, req, res)

        const hospital = await find({ hid })

        return hospital ? res.status(STATUS_200_OK).json(hospital) : sendNotFoundError(res)
      }
      case METHOD_DELETE: {
        const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

        checkIsSuperAdmin(currentUser)

        const deleted = await del({ hid }, currentUser)

        if (!deleted) return sendNotFoundError(res)

        return res.status(STATUS_200_OK).json({ deleted })
      }
      case METHOD_PUT: {
        const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

        checkIsSuperAdmin(currentUser)

        const updated = await update({ hid }, req.body)

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
