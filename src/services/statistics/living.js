import knex from "../../knex/knex"
import { ISO_DATE } from "../../utils/date"
import { normalizeInputs, averageOf } from "./common"
import { buildScope } from "../scope"

/**
 * Request and format the living statistics.
 *
 * @param {*} filters ex: {startDate, endDate, scopeFilter}
 * @param {*} currentUser
 *
 * @return object with shape: { inputs, globalCount, averageCount, actsWithPv, actTypes, hours, examinations }
 */
export const buildLivingStatistics = async (filters, currentUser) => {
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

  return await Promise.all([
    fetchGlobalCount,
    fetchAverageCount,
    fetchActsWithPv,
    fetchActTypes,
    fetchHours,
    fetchExaminations,
  ]).then(([[globalCount], averageCount, actsWithPv, actTypes, [hours], [examinations]]) => {
    return {
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
    }
  })
}
