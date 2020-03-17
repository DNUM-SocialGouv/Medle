import Cors from "micro-cors"

import { STATUS_200_OK, METHOD_POST, METHOD_OPTIONS } from "../../../utils/http"
import knex from "../../../knex/knex"
import { STATS_GLOBAL } from "../../../utils/roles"
import { sendAPIError } from "../../../utils/api"
import { checkValidUserWithPrivilege, getReachableScope } from "../../../utils/auth"
// import { logError } from "../../../utils/logger"
import { ISO_DATE } from "../../../utils/date"
import { normalizeInputs, averageOf } from "../../../common/api/statistics"

const handler = (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // privilege verification
      const currentUser = checkValidUserWithPrivilege(STATS_GLOBAL, req, res)
      const reachableScope = getReachableScope(currentUser)

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

      // request verification
      const { startDate, endDate, scopeFilter } = normalizeInputs(req.body, reachableScope, currentUser.role)

      const fetchGlobalCount = knex("acts")
         .select(knex.raw("count(1)::integer"))
         .whereNull("deleted_at")
         .where(builder => {
            if (scopeFilter.length) {
               builder.whereIn("hospital_id", scopeFilter)
            }
         })
         .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
         .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
         .whereRaw(
            `profile <> 'Personne décédée' and profile <> 'Autre activité/Assises' and profile <> 'Autre activité/Reconstitution'`,
         )

      const fetchAverageCount = knex
         .from(knex.raw(`avg_acts('${startDate}', '${endDate}')`))
         .where(builder => {
            if (scopeFilter.length) {
               builder.whereIn("id", scopeFilter)
            }
         })
         .where("type", "=", "Vivant")
         .select(knex.raw("avg"))

      const fetchActsWithPv = knex("acts")
         .select(
            knex.raw(
               "case when pv_number is not null and pv_number <> '' then 'Avec réquisition' " +
                  "when asker_id is null then 'Recueil de preuve sans plainte' " +
                  "else 'Sans réquisition' " +
                  "end as type," +
                  "count(*)::integer",
            ),
         )
         .where(builder => {
            if (scopeFilter.length) {
               builder.whereIn("hospital_id", scopeFilter)
            }
         })
         .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
         .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
         .groupBy("type")

      const fetchActTypes = knex("acts")
         .select(knex.raw("count(*)::integer, extra_data->'examinationTypes' as name"))
         .where(builder => {
            if (scopeFilter.length) {
               builder.whereIn("hospital_id", scopeFilter)
            }
         })
         .whereRaw(
            `(extra_data->'examinationTypes' @> '["Psychiatrique"]' or ` +
               `extra_data->'examinationTypes' @> '["Somatique"]')`,
         )
         .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
         .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
         .groupByRaw(`extra_data->'examinationTypes'`)

      const fetchHours = knex("acts")
         .select(
            knex.raw(
               `count(1) filter (where extra_data->'periodOfDay' <@ '["Matin", "Après-midi", "Journée"]')::integer as "Journée",` +
                  `count(1) filter (where extra_data->>'periodOfDay' = 'Soirée')::integer as "Soirée",` +
                  `count(1) filter (where extra_data->>'periodOfDay' = 'Nuit profonde')::integer as "Nuit profonde"`,
            ),
         )
         .where(builder => {
            if (scopeFilter.length) {
               builder.whereIn("hospital_id", scopeFilter)
            }
         })
         .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
         .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)

      const fetchExaminations = knex("acts")
         .select(
            knex.raw(
               `count(1) filter (where extra_data->'examinations' @> '["Biologie"]')::integer as "Biologie",` +
                  `count(1) filter (where extra_data->'examinations' @> '["Imagerie"]')::integer as "Imagerie",` +
                  `count(1) filter (where extra_data->'examinations' @> '["Toxicologie"]')::integer as "Toxicologie",` +
                  `count(1) filter (where extra_data->'examinations' @> '["Anapath"]')::integer as "Anapath",` +
                  `count(1) filter (where extra_data->'examinations' @> '["Génétique"]')::integer as "Génétique",` +
                  `count(1) filter (where extra_data->'examinations' @> '["Autres"]')::integer as "Autres"`,
            ),
         )
         .where(builder => {
            if (scopeFilter.length) {
               builder.whereIn("hospital_id", scopeFilter)
            }
         })
         .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
         .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)

      Promise.all([
         fetchGlobalCount,
         fetchAverageCount,
         fetchActsWithPv,
         fetchActTypes,
         fetchHours,
         fetchExaminations,
      ]).then(([[globalCount], averageCount, actsWithPv, actTypes, [hours], [examinations]]) => {
         return res.status(STATUS_200_OK).json({
            inputs: {
               startDate,
               endDate,
               scopeFilter,
            },
            globalCount: globalCount.count || 0,
            averageCount:
               averageCount && averageCount.length ? averageOf(averageCount.map(elt => parseFloat(elt.avg, 10))) : 0,
            actsWithPv: actsWithPv.reduce(
               (acc, current) => ({
                  ...acc,
                  [current.type]: current.count,
               }),
               {
                  "Avec réquisition": 0,
                  "Sans réquisition": 0,
                  "Recueil de preuve sans plainte": 0,
               },
            ),
            actTypes: actTypes.reduce(
               (acc, current) => {
                  const [name] = current.name
                  if (name === "Somatique") return { ...acc, Somatique: current.count }
                  else if (name === "Psychiatrique") return { ...acc, Psychiatrique: current.count }
               },
               {
                  Somatique: 0,
                  Psychiatrique: 0,
               },
            ),
            hours,
            examinations,
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
