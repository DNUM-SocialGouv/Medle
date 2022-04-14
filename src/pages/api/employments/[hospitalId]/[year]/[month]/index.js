import Cors from "micro-cors"

import { find, update } from "../../../../../../services/employments"
import { sendAPIError, sendMethodNotAllowedError, sendNotFoundError } from "../../../../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../../../../utils/auth"
import { METHOD_GET, METHOD_OPTIONS, METHOD_PUT, STATUS_200_OK } from "../../../../../../utils/http"
import { EMPLOYMENT_CONSULTATION, EMPLOYMENT_MANAGEMENT } from "../../../../../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  const { year, month, hospitalId } = req.query

  try {
    switch (req.method) {
      case METHOD_GET: {
        checkValidUserWithPrivilege(EMPLOYMENT_CONSULTATION, req, res)

        const dataMonth = await find({ year, month, hospitalId })

        return res.status(STATUS_200_OK).json(dataMonth)
      }
      case METHOD_PUT: {
        checkValidUserWithPrivilege(EMPLOYMENT_MANAGEMENT, req, res)

        const data = req.body
        const result = await update({ year, month, hospitalId, data })

        return result ? res.status(STATUS_200_OK).json(result) : sendNotFoundError(res)
      }
      default:
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    sendAPIError(error, res)
  }
}

const cors = Cors({
  allowMethods: [METHOD_GET, METHOD_PUT, METHOD_OPTIONS],
})

export default cors(handler)
