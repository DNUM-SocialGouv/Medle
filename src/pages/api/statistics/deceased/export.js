import Cors from "micro-cors"

import { sendAPIError, sendForbiddenError, sendMethodNotAllowedError } from "../../../../services/errorHelpers"
import { exportDeceasedStatistics } from "../../../../services/statistics/deceased"
import { checkValidUserWithPrivilege } from "../../../../utils/auth"
import { CORS_ALLOW_ORIGIN, METHOD_GET, METHOD_OPTIONS, STATUS_200_OK } from "../../../../utils/http"
import { logDebug } from "../../../../utils/logger"
import { STATS_GLOBAL } from "../../../../utils/roles"
import { isAllowedHospitals } from "../../../../utils/scope"

/**
 * API endpoint for living statistics export.
 *
 */
const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  const { startDate, endDate, scopeFilter } = req.query

  try {
    switch (req.method) {
      case METHOD_GET: {
        const currentUser = checkValidUserWithPrivilege(STATS_GLOBAL, req, res)

        if (scopeFilter && scopeFilter.length > 0 && !isAllowedHospitals(currentUser, scopeFilter))
          return sendForbiddenError(res)

        const workbook = await exportDeceasedStatistics({ startDate, endDate, scopeFilter }, currentUser)

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx")

        await workbook.xlsx.write(res)

        logDebug("Export fichier XLSX")

        return res.status(STATUS_200_OK).end()
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
