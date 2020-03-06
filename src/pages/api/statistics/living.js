import Cors from "micro-cors"

import { STATUS_200_OK, METHOD_POST, METHOD_OPTIONS } from "../../../utils/http"
import knex from "../../../knex/knex"
import { STATS_GLOBAL } from "../../../utils/roles"
import { sendAPIError } from "../../../utils/api"
import { checkValidUserWithPrivilege, getReachableScope } from "../../../utils/auth"
// import { logError } from "../../../utils/logger"
import { ISO_DATE } from "../../../utils/date"
import { normalizeInputs } from "../../../common/api/statistics"

const handler = (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // privilege verification
      const currentUser = checkValidUserWithPrivilege(STATS_GLOBAL, req, res)
      const scope = getReachableScope(currentUser)

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
      const { startDate, endDate, isNational } = normalizeInputs(req.body)

      const fetchGlobalCount = () =>
         knex("acts")
            .select(knex.raw("count(1)::integer"))
            .whereNull("deleted_at")
            .where(builder => {
               if (!isNational) {
                  builder.whereIn("hospital_id", scope)
               }
            })
            .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
            .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
            .whereRaw(
               `profile <> 'Personne décédée' and profile <> 'Autre activité/Assises' and profile <> 'Autre activité/Reconstitution'`,
            )

      const fetchAverageCount = () =>
         knex("living_acts_by_day")
            .select(knex.raw("avg(nb_acts)::integer"))
            .where(builder => {
               if (!isNational) {
                  builder.whereIn("hospital_id", scope)
               }
            })
            .whereRaw(`day >= TO_DATE(?, '${ISO_DATE}')`, startDate)
            .whereRaw(`day <= TO_DATE(?, '${ISO_DATE}')`, endDate)

      const fetchActsWithPv = () =>
         knex("acts")
            .select(
               knex.raw(
                  "case when pv_number is not null and pv_number <> '' then 'withRequisition' " +
                     "when asker_id is null then 'withoutPlaint' " +
                     "else 'withoutRequisition' " +
                     "end as type," +
                     "count(*)::integer",
               ),
            )
            .where(builder => {
               if (!isNational) {
                  builder.whereIn("hospital_id", scope)
               }
            })
            .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
            .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
            .groupBy("type")

      const fetchActTypes = () =>
         knex("acts")
            .select(knex.raw("count(*)::integer, extra_data->'examinationTypes' as name"))
            .where(builder => {
               if (!isNational) {
                  builder.whereIn("hospital_id", scope)
               }
            })
            .whereRaw(
               `(extra_data->'examinationTypes' @> '["Psychiatrique"]' or ` +
                  `extra_data->'examinationTypes' @> '["Somatique"]')`,
            )
            .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
            .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
            .groupByRaw(`extra_data->'examinationTypes'`)

      const fetchHours = () =>
         knex("acts")
            .select(
               knex.raw(
                  `count(1) filter (where extra_data->'periodOfDay' <@ '["Matin", "Après-midi", "Journée"]')::integer as day,` +
                     `count(1) filter (where extra_data->>'periodOfDay' = 'Soirée')::integer as evening,` +
                     `count(1) filter (where extra_data->>'periodOfDay' = 'Nuit profonde')::integer as night`,
               ),
            )
            .where(builder => {
               if (!isNational) {
                  builder.whereIn("hospital_id", scope)
               }
            })
            .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
            .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)

      const fetchExaminations = () =>
         knex("acts")
            .select(
               knex.raw(
                  `count(1) filter (where extra_data->'examinations' @> '["Biologie"]')::integer as biology,` +
                     `count(1) filter (where extra_data->'examinations' @> '["Imagerie"]')::integer as image,` +
                     `count(1) filter (where extra_data->'examinations' @> '["Toxicologie"]')::integer as toxicology,` +
                     `count(1) filter (where extra_data->'examinations' @> '["Anapath"]')::integer as anapath,` +
                     `count(1) filter (where extra_data->'examinations' @> '["Génétique"]')::integer as genetic,` +
                     `count(1) filter (where extra_data->'examinations' @> '["Autres"]')::integer as others`,
               ),
            )
            .where(builder => {
               if (!isNational) {
                  builder.whereIn("hospital_id", scope)
               }
            })
            .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
            .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)

      Promise.all([
         fetchGlobalCount(),
         fetchAverageCount(),
         fetchActsWithPv(),
         fetchActTypes(),
         fetchHours(),
         fetchExaminations(),
      ]).then(([[globalCount], [averageCount], actsWithPv, actTypes, [hours], [examinations]]) => {
         return res.status(STATUS_200_OK).json({
            inputs: {
               startDate,
               endDate,
               isNational,
               scope,
            },
            globalCount: globalCount.count || 0,
            averageCount: averageCount.avg || 0,
            actsWithPv: actsWithPv.reduce(
               (acc, current) => ({
                  ...acc,
                  [current.type]: current.count,
               }),
               {
                  withRequisition: 0,
                  withoutRequisition: 0,
                  withoutPlaint: 0,
               },
            ),
            actTypes: actTypes.reduce(
               (acc, current) => {
                  const [name] = current.name
                  if (name === "Somatique") return { ...acc, somatic: current.count }
                  else if (name === "Psychiatrique") return { ...acc, psychiatric: current.count }
               },
               {
                  somatic: 0,
                  psychiatric: 0,
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
