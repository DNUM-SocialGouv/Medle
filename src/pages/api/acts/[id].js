import Cors from "micro-cors"

import { del, find, update } from "../../../services/acts"
import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"
import { APIError } from "../../../utils/errors"
import {
  METHOD_DELETE,
  METHOD_GET,
  METHOD_OPTIONS,
  METHOD_PUT,
  STATUS_200_OK,
  STATUS_404_NOT_FOUND,
} from "../../../utils/http"
import { ACT_CONSULTATION, ACT_MANAGEMENT } from "../../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  const { id } = req.query

  try {
    switch (req.method) {
      case METHOD_GET: {
        const currentUser = checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

        const act = await find({ id }, currentUser)

        if (!act) {
          throw new APIError({
            status: STATUS_404_NOT_FOUND,
            message: "Not found",
          })
        }

        return res.status(STATUS_200_OK).json(act)
      }
      case METHOD_DELETE: {
        const currentUser = checkValidUserWithPrivilege(ACT_MANAGEMENT, req, res)

        const deleted = await del({ id }, currentUser)

        return res.status(STATUS_200_OK).json({ deleted })
      }
      case METHOD_PUT: {
        const currentUser = checkValidUserWithPrivilege(ACT_MANAGEMENT, req, res)

        const updated = await update({ id }, req.body, currentUser)

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
  allowMethods: [METHOD_DELETE, METHOD_GET, METHOD_OPTIONS, METHOD_PUT],
})

export default cors(handler)
