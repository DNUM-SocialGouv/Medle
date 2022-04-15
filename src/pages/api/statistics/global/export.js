import Cors from "micro-cors"

import { sendAPIError, sendForbiddenError, sendMethodNotAllowedError } from "../../../../services/errorHelpers"
import { exportGlobalStatistics } from "../../../../services/statistics/global"
import { checkValidUserWithPrivilege } from "../../../../utils/auth"
import { CORS_ALLOW_ORIGIN, METHOD_GET, METHOD_OPTIONS, STATUS_200_OK } from "../../../../utils/http"
import { logDebug } from "../../../../utils/logger"
import { STATS_GLOBAL } from "../../../../utils/roles"
import { isAllowedHospitals } from "../../../../utils/scope"

/**
 * API endpoint for global statistics export.
 *
 * Si pas de currentUser.role == ["OPERATOR_ACT", etc..] -> le user est un user d'hôpital. Son scope local est son seul hôpital
 * Si currentUser.role == ["REGIONAL_SUPERVISOR", etc..] -> son scope local est l'ensemble des établissements composants la "région"
 * Si currentUser.rol == ["PUBLIC_SUPERVISOR", etc..] -> il n'a pas de scope local. Les requêtes ne sont pas filtrées par scope
 *
 * ATTENTION: le scopeFilter doit être compatible avec le scope accessible par l'utilisateur (reachableScope).
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

        const workbook = await exportGlobalStatistics({ startDate, endDate, scopeFilter }, currentUser)

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
