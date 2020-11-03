import Cors from "micro-cors"

import { STATUS_200_OK, METHOD_DELETE, METHOD_GET, METHOD_PUT, METHOD_OPTIONS } from "../../../../../utils/http"
import { ADMIN } from "../../../../../utils/roles"
import { sendAPIError, sendMethodNotAllowedError, sendNotFoundError } from "../../../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../../../utils/auth"
import { del, find, update } from "../../../../../services/employments-references"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  const { hid, rid } = req.query

  try {
    switch (req.method) {
      case METHOD_GET: {
        checkValidUserWithPrivilege(ADMIN, req, res)

        const references = await find({ hid, rid })

        return res.status(STATUS_200_OK).json(references)
      }

      case METHOD_DELETE: {
        checkValidUserWithPrivilege(ADMIN, req, res)
        const deleted = await del({ hid, rid })

        if (!deleted) return sendNotFoundError(res)

        return res.status(STATUS_200_OK).json({ deleted })
      }

      case METHOD_PUT: {
        checkValidUserWithPrivilege(ADMIN, req, res)

        const updated = await update({ hid, rid }, req.body)

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
  allowMethods: [METHOD_DELETE, METHOD_GET, METHOD_PUT, METHOD_OPTIONS],
})

export default cors(handler)
