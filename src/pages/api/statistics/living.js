import Cors from "micro-cors"
import moment from "moment"

import { STATUS_200_OK, METHOD_POST, METHOD_OPTIONS } from "../../../utils/http"
import knex from "../../../knex/knex"
import { STATS_GLOBAL } from "../../../utils/roles"
import { sendAPIError } from "../../../utils/api"
import { checkValidUserWithPrivilege, getAllScope } from "../../../utils/auth"
// import { logError } from "../../../utils/logger"
import { ISO_DATE, now } from "../../../utils/date"
import { normalizeEndDate, normalizeStartDate } from "../../../common/api/statistics"
import { fetchProfilesDistribution } from "../../../knex/queries/statistics"

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // privilege verification
      const currentUser = checkValidUserWithPrivilege(STATS_GLOBAL, req, res)

      /**
       * TODO: gérer le scope plus finement + ajout d'un champ hospitalsFilter, pour filtrer par liste d'établissements, filtre manuel de l'utilsateur
       *
       * Si pas de currentUser.role == ["OPERATOR_ACT", etc..] -> le user est un user d'hôpital. Son scope local est son seul hôpital
       * Si currentUser.role == ["REGIONAL_SUPERVISOR", etc..] -> son scope local est l'ensemble des établissements composants la "région"
       * Si currentUser.rol == ["PUBLIC_SUPERVISOR", etc..] -> il n'a pas de scope local. Les requêtes ne sont pas filtrées par scope
       *
       * ATTENTION: le hospitalsFilter doit être compatible avec le scope.
       *
       * TODO: on peut appeler le WS en GET alors que c'est censé être interdit...
       *
       */

      const scope = getAllScope(currentUser)

      // request verification
      let { startDate, endDate, isNational } = await req.body

      console.log("startDate", startDate)
      console.log("endDate", endDate)

      endDate = normalizeEndDate(endDate)
      startDate = normalizeStartDate(startDate, endDate)

      isNational = isNational === true

      Promise.all([fetchProfilesDistribution({ startDate, endDate, isNational, scope })]).then(profilesDistribution => {
         return res.status(STATUS_200_OK).json({
            inputs: {
               startDate: startDate.format(ISO_DATE),
               endDate: endDate.format(ISO_DATE),
               isNational,
               scope,
            },
            profilesDistribution: profilesDistribution.reduce(
               (acc, current) => ({ ...acc, [current.type]: current.count }),
               { deceased: 0, criminalCourt: 0, reconstitution: 0, living: 0 },
            ),
         })
      })
   } catch (error) {
      // DB error
      sendAPIError(error, res)
   }
}

const cors = Cors({
   allowMethods: [METHOD_POST, METHOD_OPTIONS],
})

export default cors(handler)
