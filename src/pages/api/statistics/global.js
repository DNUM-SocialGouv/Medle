import Cors from "micro-cors"

import { STATUS_200_OK, METHOD_POST, METHOD_OPTIONS } from "../../../utils/http"
import { STATS_GLOBAL } from "../../../utils/roles"
import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"
import { buildGlobalStatistics } from "../../../services/statistics/global"

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

   try {
      switch (req.method) {
         case METHOD_POST: {
            const currentUser = checkValidUserWithPrivilege(STATS_GLOBAL, req, res)

            const {
               inputs,
               globalCount,
               averageCount,
               profilesDistribution,
               actsWithSamePV,
               averageWithSamePV,
            } = await buildGlobalStatistics(req.body, currentUser)

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
            return sendMethodNotAllowedError(res)
      }
   } catch (error) {
      sendAPIError(error, res)
   }
}

const cors = Cors({
   allowMethods: [METHOD_POST, METHOD_OPTIONS],
})

export default cors(handler)
