import Cors from "micro-cors"

import { sendAPIError, sendMethodNotAllowedError } from "../../../../services/errorHelpers"
import { exportGlobalStatistics } from "../../../../services/statistics/global"
import { checkValidUserWithPrivilege } from "../../../../utils/auth"
import { METHOD_GET, METHOD_OPTIONS, STATUS_200_OK, CORS_ALLOW_ORIGIN } from "../../../../utils/http"
import { logDebug } from "../../../../utils/logger"
import { STATS_GLOBAL } from "../../../../utils/roles"

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

  try {
    switch (req.method) {
      case METHOD_GET: {
        const currentUser = checkValidUserWithPrivilege(STATS_GLOBAL, req, res)

        const workbook = await exportGlobalStatistics(req.query, currentUser)

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
