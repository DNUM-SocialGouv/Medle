import Cors from "micro-cors"

import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { create, search } from "../../../services/hospitals"
import { checkIsSuperAdmin, checkValidUserWithPrivilege } from "../../../utils/auth"
import { METHOD_GET, METHOD_OPTIONS, METHOD_POST, STATUS_200_OK } from "../../../utils/http"
import { ADMIN, STATS_GLOBAL } from "../../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")

  try {
    switch (req.method) {
      case METHOD_GET: {
        checkValidUserWithPrivilege(STATS_GLOBAL, req, res)

        const hospitals = await search(req.query)

        return res.status(STATUS_200_OK).json(hospitals)
      }
      case METHOD_POST: {
        const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

        checkIsSuperAdmin(currentUser)

        const id = await create(req.body)

        return res.status(STATUS_200_OK).json({ id })
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
