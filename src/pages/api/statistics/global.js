import Cors from "micro-cors"
import moment from "moment"

import { STATUS_200_OK, METHOD_POST, METHOD_OPTIONS } from "../../../utils/http"
import knex from "../../../knex/knex"
import { STATS_GLOBAL } from "../../../utils/roles"
import { checkValidUserWithPrivilege, sendAPIError } from "../../../utils/api"
// import { logError } from "../../../utils/logger"
import { ISO_DATE, now } from "../../../utils/date"

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

      let scope = currentUser.scope || []
      scope = currentUser.hospitalId ? [...scope, currentUser.hospitalId] : scope

      // request verification
      let { startDate, endDate, isNational } = await req.body

      console.log("startDate", startDate)
      console.log("endDate", endDate)

      const defaultEndDate = now()
      const defaultStartDate = date => moment(date).startOf("year")

      if (!endDate) {
         endDate = defaultEndDate
      } else {
         endDate = moment(endDate, ISO_DATE)
         endDate = endDate.isValid() ? endDate : defaultEndDate
      }

      if (!startDate) {
         startDate = defaultStartDate(endDate)
      } else {
         startDate = moment(startDate, ISO_DATE)
         startDate = startDate.isValid() && startDate.isBefore(endDate) ? startDate : defaultStartDate(endDate)
      }

      isNational = isNational === true

      const fetchGlobalCount = knex("acts")
         .select(knex.raw("count(1)::integer"))
         .whereNull("deleted_at")
         .where(builder => {
            if (!isNational) {
               builder.whereIn("hospital_id", scope)
            }
         })
         .whereRaw(`created_at >= TO_DATE(?, '${ISO_DATE}')`, startDate.format(ISO_DATE))
         .whereRaw(`created_at <= TO_DATE(?, '${ISO_DATE}')`, endDate.format(ISO_DATE))

      const fetchAverageCount = knex("acts_by_day")
         .select(knex.raw("avg(nb_acts)::integer"))
         .where(builder => {
            if (!isNational) {
               builder.whereIn("hospital_id", scope)
            }
         })
         .whereRaw(`day >= TO_DATE(?, '${ISO_DATE}')`, startDate.format(ISO_DATE))
         .whereRaw(`day <= TO_DATE(?, '${ISO_DATE}')`, endDate.format(ISO_DATE))

      const fetchProfilesDistribution = knex("acts")
         .select(
            knex.raw(
               "case " +
                  "when profile = 'Personne décédée' then 'deceased' " +
                  "when profile = 'Autre activité/Assises' then 'criminalCourt' " +
                  "when profile = 'Autre activité/Reconstitution' then 'reconstitution' " +
                  "else 'living' end as type, count(*)::integer",
            ),
         )
         .whereNull("deleted_at")
         .where(builder => {
            if (!isNational) {
               builder.whereIn("hospital_id", scope)
            }
         })
         .whereRaw(`created_at >= TO_DATE(?, '${ISO_DATE}')`, startDate.format(ISO_DATE))
         .whereRaw(`created_at <= TO_DATE(?, '${ISO_DATE}')`, endDate.format(ISO_DATE))
         .groupBy("type")

      const fetchActsWithSamePV = knex
         .with("acts_with_same_pv", builder => {
            builder
               .select(knex.raw("pv_number, count(1) as count"))
               .from("acts")
               .whereNull("deleted_at")
               .where(builder => {
                  if (!isNational) {
                     builder.whereIn("hospital_id", scope)
                  }
               })
               .whereRaw(`created_at >= TO_DATE(?, '${ISO_DATE}')`, startDate.format(ISO_DATE))
               .whereRaw(`created_at <= TO_DATE(?, '${ISO_DATE}')`, endDate.format(ISO_DATE))
               .whereRaw("pv_number is not null and pv_number <> ''")
               .groupBy("pv_number")
               .havingRaw("count(1) > 1")
         })
         .select(knex.raw("sum(count)::integer"))
         .from("acts_with_same_pv")

      const fetchAverageWithSamePV = knex
         .with("acts_with_same_pv", builder => {
            builder
               .select(knex.raw("count(*) as count"))
               .from("acts")
               .whereNull("deleted_at")
               .where(builder => {
                  if (!isNational) {
                     builder.whereIn("hospital_id", scope)
                  }
               })
               .whereRaw(`created_at >= TO_DATE(?, '${ISO_DATE}')`, startDate.format(ISO_DATE))
               .whereRaw(`created_at <= TO_DATE(?, '${ISO_DATE}')`, endDate.format(ISO_DATE))
               .whereRaw("pv_number is not null and pv_number <> ''")
               .groupBy("pv_number")
         })
         .select(knex.raw("avg(count)::integer"))
         .from("acts_with_same_pv")

      Promise.all([
         fetchGlobalCount,
         fetchAverageCount,
         fetchProfilesDistribution,
         fetchActsWithSamePV,
         fetchAverageWithSamePV,
      ]).then(([[globalCount], [averageCount], profilesDistribution, [actsWithSamePV], [averageWithSamePV]]) => {
         return res.status(STATUS_200_OK).json({
            inputs: {
               startDate: startDate.format(ISO_DATE),
               endDate: endDate.format(ISO_DATE),
               isNational,
               scope,
            },
            globalCount: globalCount.count || 0,
            averageCount: averageCount.avg || 0,
            profilesDistribution: profilesDistribution.reduce(
               (acc, current) => ({ ...acc, [current.type]: current.count || 0 }),
               {},
            ),
            actsWithSamePV: actsWithSamePV.sum || 0,
            averageWithSamePV: averageWithSamePV.avg || 0,
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
