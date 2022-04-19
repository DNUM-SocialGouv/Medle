import Cors from "micro-cors"

import { sendAPIError, sendMethodNotAllowedError } from "../../../../services/errorHelpers"
import { exportLivingStatistics } from "../../../../services/statistics/living"
import { checkValidUserWithPrivilege } from "../../../../utils/auth"
import { METHOD_GET, METHOD_OPTIONS, STATUS_200_OK, CORS_ALLOW_ORIGIN } from "../../../../utils/http"
import { logDebug } from "../../../../utils/logger"
import { STATS_GLOBAL } from "../../../../utils/roles"

/**
 * API endpoint for living statistics export.
 *
 */
const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    switch (req.method) {
      case METHOD_GET: {
        const currentUser = checkValidUserWithPrivilege(STATS_GLOBAL, req, res)

        const workbook = await exportLivingStatistics(req.query, currentUser)

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
