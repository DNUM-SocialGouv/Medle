import Cors from "micro-cors"

import { sendAPIError, sendForbiddenError, sendMethodNotAllowedError } from "../../../../services/errorHelpers"
import { buildGlobalStatistics } from "../../../../services/statistics/global"
import { checkValidUserWithPrivilege } from "../../../../utils/auth"
import { CORS_ALLOW_ORIGIN, METHOD_OPTIONS, METHOD_POST, STATUS_200_OK } from "../../../../utils/http"
import { STATS_GLOBAL } from "../../../../utils/roles"
import { isAllowedHospitals } from "../../../../utils/scope"

/**
 * API endpoint for global statistics.
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
      case METHOD_POST: {
        const currentUser = checkValidUserWithPrivilege(STATS_GLOBAL, req, res)

        const { scopeFilter } = req.body

        if (scopeFilter && scopeFilter.length > 0 && !isAllowedHospitals(currentUser, scopeFilter))
          return sendForbiddenError(res)

        const { inputs, globalCount, averageCount, profilesDistribution, actsWithSamePV, averageWithSamePV } =
          await buildGlobalStatistics(req.body, currentUser)

        return res.status(STATUS_200_OK).json({
          inputs,
          globalCount,
          averageCount,
          profilesDistribution,
          actsWithSamePV,
          averageWithSamePV,
        })
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
