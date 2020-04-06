import knex from "../../knex/knex"
import { ISO_DATE } from "../../utils/date"
import { normalizeInputs, averageOf } from "./common"
import { buildScope } from "../../services/scope"

/**
 * Request and format the global statistics.
 *
 * @param {*} filters ex: {startDate, endDate, scopeFilter}
 * @param {*} currentUser
 *
 * @return oject with shape: { inputs, globalCount, averageCount, profilesDistribution, actsWithSamePV, averageWithSamePV }
 */
export const buildGlobalStatistics = async (filters, currentUser) => {
   const reachableScope = buildScope(currentUser)

   const { startDate, endDate, scopeFilter } = normalizeInputs(filters, reachableScope)

   const fetchGlobalCount = knex("acts_by_day")
      .select(knex.raw("sum(nb_acts)::integer  as count"))
      .where(builder => {
         if (scopeFilter.length) {
            builder.whereIn("hospital_id", scopeFilter)
         }
      })
      .whereRaw(`day >= TO_DATE(?, '${ISO_DATE}')`, startDate)
      .whereRaw(`day <= TO_DATE(?, '${ISO_DATE}')`, endDate)

   const fetchAverageCount = knex
      .from(knex.raw(`avg_acts('${startDate}', '${endDate}')`))
      .where(builder => {
         if (scopeFilter.length) {
            builder.whereIn("id", scopeFilter)
         }
      })
      .select(knex.raw("avg"))

   const fetchProfilesDistribution = knex("acts_by_day")
      .select(knex.raw("type, sum(nb_acts)::integer as count"))
      .where(builder => {
         if (scopeFilter.length) {
            builder.whereIn("hospital_id", scopeFilter)
         }
      })
      .whereRaw(`day >= TO_DATE(?, '${ISO_DATE}')`, startDate)
      .whereRaw(`day <= TO_DATE(?, '${ISO_DATE}')`, endDate)
      .groupBy("type")

   const fetchActsWithSamePV = knex
      .with("acts_with_same_pv", builder => {
         builder
            .select(knex.raw("pv_number, count(1) as count"))
            .from("acts")
            .whereNull("deleted_at")
            .where(builder => {
               if (scopeFilter.length) {
                  builder.whereIn("hospital_id", scopeFilter)
               }
            })
            .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
            .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
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
               if (scopeFilter.length) {
                  builder.whereIn("hospital_id", scopeFilter)
               }
            })
            .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
            .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
            .whereRaw("pv_number is not null and pv_number <> ''")
            .groupBy("pv_number")
      })
      .select(knex.raw("avg(count)::integer"))
      .from("acts_with_same_pv")

   return await Promise.all([
      fetchGlobalCount,
      fetchAverageCount,
      fetchProfilesDistribution,
      fetchActsWithSamePV,
      fetchAverageWithSamePV,
   ]).then(([[globalCount], averageCount, profilesDistribution, [actsWithSamePV], [averageWithSamePV]]) => {
      return {
         inputs: {
            startDate,
            endDate,
            scopeFilter,
         },
         globalCount: globalCount.count || 0,
         averageCount:
            averageCount && averageCount.length ? averageOf(averageCount.map(elt => parseFloat(elt.avg, 10))) : 0,
         profilesDistribution: profilesDistribution.reduce(
            (acc, current) => ({ ...acc, [current.type]: current.count }),
            {
               "Personne décédée": 0,
               "Autre activité/Assises": 0,
               "Autre activité/Reconstitution": 0,
               Vivant: 0,
            },
         ),
         actsWithSamePV: actsWithSamePV.sum || 0,
         averageWithSamePV: averageWithSamePV.avg || 0,
      }
   })
}
