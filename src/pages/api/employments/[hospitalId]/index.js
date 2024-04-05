import Cors from "micro-cors"

import { findByHospitalId } from "../../../../services/employments"
import {
  sendAPIError,
  sendForbiddenError,
  sendMethodNotAllowedError,
} from "../../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../../utils/auth"
import { CORS_ALLOW_ORIGIN, METHOD_GET, METHOD_OPTIONS, METHOD_PUT, STATUS_200_OK } from "../../../../utils/http"
import { EMPLOYMENT_CONSULTATION, EMPLOYMENT_MANAGEMENT } from "../../../../utils/roles"
import { isAllowedHospitals } from "../../../../utils/scope"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  const { hospitalId } = req.query

  try {
    switch (req.method) {
      case METHOD_GET: {
        const currentUser = checkValidUserWithPrivilege(EMPLOYMENT_CONSULTATION, req, res)

        if (!isAllowedHospitals(currentUser, hospitalId)) return sendForbiddenError(res)

        const hospitalEmployments = await findByHospitalId({ hospitalId })

        return res.status(STATUS_200_OK).json(hospitalEmployments)
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
