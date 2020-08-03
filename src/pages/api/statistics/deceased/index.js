import Cors from "micro-cors"

import { STATUS_200_OK, METHOD_POST, METHOD_OPTIONS } from "../../../../utils/http"
import { STATS_GLOBAL } from "../../../../utils/roles"
import { sendAPIError, sendMethodNotAllowedError } from "../../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../../utils/auth"
import { buildDeceasedStatistics } from "../../../../services/statistics/deceased"

/**
 * API endpoint for deceased statistics.
 *
 * @param {*} req
 * @param {*} res
 */
const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")

  try {
    switch (req.method) {
      case METHOD_POST: {
        const currentUser = checkValidUserWithPrivilege(STATS_GLOBAL, req, res)

        const {
          inputs,
          globalCount,
          averageCount,
          actsWithPv,
          actTypes,
          hours,
          examinations,
        } = await buildDeceasedStatistics(req.body, currentUser)

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
