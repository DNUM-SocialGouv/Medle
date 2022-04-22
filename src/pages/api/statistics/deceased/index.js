import Cors from "micro-cors"

import { sendAPIError, sendForbiddenError, sendMethodNotAllowedError } from "../../../../services/errorHelpers"
import { buildDeceasedStatistics } from "../../../../services/statistics/deceased"
import { checkValidUserWithPrivilege } from "../../../../utils/auth"
import { METHOD_OPTIONS, METHOD_POST, STATUS_200_OK, CORS_ALLOW_ORIGIN } from "../../../../utils/http"
import { STATS_GLOBAL } from "../../../../utils/roles"
import { isAllowedHospitals } from "../../../../utils/scope"

/**
 * API endpoint for deceased statistics.
 *
 * @param {*} req
 * @param {*} res
 */
const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    switch (req.method) {
      case METHOD_POST: {
        const currentUser = checkValidUserWithPrivilege(STATS_GLOBAL, req, res)

        const { scopeFilter } = req.body

        if (scopeFilter && scopeFilter.length > 0 && !isAllowedHospitals(currentUser, scopeFilter))
          return sendForbiddenError(res)

        const { inputs, globalCount, averageCount, actsWithPv, actTypes, hours, examinations } =
          await buildDeceasedStatistics(req.body, currentUser)

        return res
          .status(STATUS_200_OK)
          .json({ inputs, globalCount, averageCount, actsWithPv, actTypes, hours, examinations })
      }
      default:
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    sendAPIError(error, res)
  }
}

const cors = Cors({
  allowMethods: [METHOD_POST, METHOD_OPTIONS],
})

export default cors(handler)
