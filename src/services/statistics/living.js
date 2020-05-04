import Excel from "exceljs"

import knex from "../../knex/knex"
import { ISO_DATE, now } from "../../utils/date"
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
    .where((builder) => {
      if (scopeFilter.length) {
        builder.whereIn("hospital_id", scopeFilter)
      }
    })
    .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
    .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
    .whereRaw(
      `profile <> 'Personne décédée' and profile <> 'Autre activité/Assises' and profile <> 'Autre activité/Reconstitution'`
    )

  const fetchAverageCount = knex
    .from(knex.raw(`avg_acts('${startDate}', '${endDate}')`))
    .where((builder) => {
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
          "count(*)::integer"
      )
    )
    .where((builder) => {
      if (scopeFilter.length) {
        builder.whereIn("hospital_id", scopeFilter)
      }
    })
    .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
    .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
    .groupBy("type")

  const fetchActTypes = knex("acts")
    .select(knex.raw("count(*)::integer, extra_data->'examinationTypes' as name"))
    .where((builder) => {
      if (scopeFilter.length) {
        builder.whereIn("hospital_id", scopeFilter)
      }
    })
    .whereRaw(
      `(extra_data->'examinationTypes' @> '["Psychiatrique"]' or ` +
        `extra_data->'examinationTypes' @> '["Somatique"]')`
    )
    .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
    .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
    .groupByRaw(`extra_data->'examinationTypes'`)

  const fetchHours = knex("acts")
    .select(
      knex.raw(
        `count(1) filter (where extra_data->'periodOfDay' <@ '["Matin", "Après-midi", "Journée"]')::integer as "Journée",` +
          `count(1) filter (where extra_data->>'periodOfDay' = 'Soirée')::integer as "Soirée",` +
          `count(1) filter (where extra_data->>'periodOfDay' = 'Nuit profonde')::integer as "Nuit profonde"`
      )
    )
    .where((builder) => {
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
          `count(1) filter (where extra_data->'examinations' @> '["Autres"]')::integer as "Autres"`
      )
    )
    .where((builder) => {
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
        averageCount && averageCount.length ? averageOf(averageCount.map((elt) => parseFloat(elt.avg, 10))) : 0,
      actsWithPv: actsWithPv.reduce(
        (acc, current) => ({
          ...acc,
          [current.type]: current.count,
        }),
        {
          "Avec réquisition": 0,
          "Sans réquisition": 0,
          "Recueil de preuve sans plainte": 0,
        }
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
        }
      ),
      hours,
      examinations,
    }
  })
}

export const exportLivingStatistics = async ({ startDate, endDate, scopeFilter }, currentUser) => {
  scopeFilter = scopeFilter && JSON.parse(scopeFilter)

  const { inputs, globalCount, averageCount, actsWithPv, actTypes, hours, examinations } = await buildLivingStatistics(
    { startDate, endDate, scopeFilter },
    currentUser
  )

  const workbook = new Excel.Workbook()

  workbook.created = now()
  workbook.modified = now()

  const actsWorksheet = workbook.addWorksheet("Statistiques vivants")

  actsWorksheet.columns = [
    { header: "Statistique", key: "name", width: 40 },
    { header: "Valeur", key: "value", width: 20 },
  ]

  actsWorksheet.addRow({ name: "Nb actes au total", value: globalCount })
  actsWorksheet.addRow({ name: "Nb actes par jour en moyenne", value: averageCount })

  actsWorksheet.addRow({})
  actsWorksheet.addRow({ name: "Nb actes avec n° de réquisition", value: actsWithPv?.["Avec réquisition"] })
  actsWorksheet.addRow({ name: "Nb actes sans n° de réquisition", value: actsWithPv?.["Sans réquisition"] })
  actsWorksheet.addRow({
    name: "Nb actes avec recueil de preuves sans plainte",
    value: actsWithPv?.["Recueil de preuve sans plainte"],
  })

  actsWorksheet.addRow({})
  actsWorksheet.addRow({ name: "Nb actes avec examen somatique", value: actTypes?.["Somatique"] })
  actsWorksheet.addRow({ name: "Nb actes avec examen psychiatrique", value: actTypes?.["Psychiatrique"] })
  actsWorksheet.addRow({})
  actsWorksheet.addRow({ name: "Nb actes en journées", value: hours?.["Journée"] })
  actsWorksheet.addRow({ name: "Nb actes en soirée", value: hours?.["Soirée"] })
  actsWorksheet.addRow({ name: "Nb actes en nuit profonde", value: hours?.["Nuit profonde"] })

  actsWorksheet.addRow({})
  actsWorksheet.addRow({ name: "Nb actes mentionnant biologie", value: examinations?.["Biologie"] })
  actsWorksheet.addRow({ name: "Nb actes mentionnant imagerie", value: examinations?.["Imagerie"] })
  actsWorksheet.addRow({ name: "Nb actes mentionnant toxicologie", value: examinations?.["Toxicologie"] })
  actsWorksheet.addRow({ name: "Nb actes mentionnant anapath", value: examinations?.["Anapath"] })
  actsWorksheet.addRow({ name: "Nb actes mentionnant génétique", value: examinations?.["Génétique"] })
  actsWorksheet.addRow({ name: "Nb actes mentionnant autres", value: examinations?.["Autres"] })

  const inputsWorksheet = workbook.addWorksheet("Paramètres de l'export")
  inputsWorksheet.columns = [
    { header: "Filtre", key: "name", width: 40 },
    { header: "Valeur", key: "value", width: 20 },
  ]

  inputsWorksheet.addRow({ name: "Date de début", value: inputs?.startDate })
  inputsWorksheet.addRow({ name: "Date de fin", value: inputs?.endDate })
  inputsWorksheet.addRow({ name: "Périmètre", value: inputs?.scopeFilter?.length ? inputs.scopeFilter : "National" })

  return workbook
}
