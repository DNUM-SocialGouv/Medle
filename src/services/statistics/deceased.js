import knex from "../../knex/knex"
import { ISO_DATE } from "../../utils/date"
import { normalizeInputs, averageOf } from "./common"
import { buildScope } from "../scope"

/**
 * Request and format the deceased statistics.
 *
 * @param {*} filters ex: {startDate, endDate, scopeFilter}
 * @param {*} currentUser
 *
 * @return object with shape: { inputs, globalCount, averageCount }
 */
export const buildDeceasedStatistics = async (filters, currentUser) => {
  const reachableScope = buildScope(currentUser)

  const { startDate, endDate, scopeFilter } = normalizeInputs(filters, reachableScope)

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
    .whereRaw(`profile = 'Personne décédée'`)

  const fetchAverageCount = knex
    .from(knex.raw(`avg_acts('${startDate}', '${endDate}')`))
    .where(builder => {
      if (scopeFilter.length) {
        builder.whereIn("id", scopeFilter)
      }
    })
    .where("type", "=", "Personne décédée")
    .select(knex.raw("avg"))

  return await Promise.all([fetchGlobalCount, fetchAverageCount]).then(([[globalCount], averageCount]) => {
    return {
      inputs: {
        startDate,
        endDate,
        scopeFilter,
      },
      globalCount: globalCount.count || 0,
      averageCount:
        averageCount && averageCount.length ? averageOf(averageCount.map(elt => parseFloat(elt.avg, 10))) : 0,
    }
  })
}
