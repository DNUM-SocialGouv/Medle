import Cors from "micro-cors"

import { findLastEdit } from "../../../../../services/employments"
import { sendAPIError, sendMethodNotAllowedError } from "../../../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../../../utils/auth"
import { METHOD_GET, METHOD_OPTIONS, STATUS_200_OK, CORS_ALLOW_ORIGIN } from "../../../../../utils/http"
import { EMPLOYMENT_CONSULTATION } from "../../../../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    switch (req.method) {
      case METHOD_GET: {
        checkValidUserWithPrivilege(EMPLOYMENT_CONSULTATION, req, res)

        const { hospitalId } = await req.query
        const data = await findLastEdit(hospitalId)

        return res.status(STATUS_200_OK).json(data)
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
