import Excel from "exceljs"

import knex from "../../knex/knex"
import { ISO_DATE, now } from "../../utils/date"
import { normalizeInputs, averageOf } from "./common"
import { buildScope } from "../../services/scope"
import { findList as findListHospitals } from "../hospitals"

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
    .where((builder) => {
      if (scopeFilter.length) {
        builder.whereIn("hospital_id", scopeFilter)
      }
    })
    .whereRaw(`day >= TO_DATE(?, '${ISO_DATE}')`, startDate)
    .whereRaw(`day <= TO_DATE(?, '${ISO_DATE}')`, endDate)

  const fetchAverageCount = knex
    .from(knex.raw(`avg_acts('${startDate}', '${endDate}')`))
    .where((builder) => {
      if (scopeFilter.length) {
        builder.whereIn("id", scopeFilter)
      }
    })
    .select(knex.raw("avg"))

  const fetchProfilesDistribution = knex("acts_by_day")
    .select(knex.raw("type, sum(nb_acts)::integer as count"))
    .where((builder) => {
      if (scopeFilter.length) {
        builder.whereIn("hospital_id", scopeFilter)
      }
    })
    .whereRaw(`day >= TO_DATE(?, '${ISO_DATE}')`, startDate)
    .whereRaw(`day <= TO_DATE(?, '${ISO_DATE}')`, endDate)
    .groupBy("type")

  const fetchActsWithSamePV = knex
    .with("acts_with_same_pv", (builder) => {
      builder
        .select(knex.raw("pv_number, count(1) as count"))
        .from("acts")
        .whereNull("deleted_at")
        .where((builder) => {
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
    .with("acts_with_same_pv", (builder) => {
      builder
        .select(knex.raw("count(*) as count"))
        .from("acts")
        .whereNull("deleted_at")
        .where((builder) => {
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
        averageCount && averageCount.length ? averageOf(averageCount.map((elt) => parseFloat(elt.avg, 10))) : 0,
      profilesDistribution: profilesDistribution.reduce((acc, current) => ({ ...acc, [current.type]: current.count }), {
        "Personne décédée": 0,
        "Autre activité/Assises": 0,
        "Autre activité/Reconstitution": 0,
        Vivant: 0,
      }),
      actsWithSamePV: actsWithSamePV.sum || 0,
      averageWithSamePV: averageWithSamePV.avg || 0,
    }
  })
}

export const exportGlobalStatistics = async ({ startDate, endDate, scopeFilter }, currentUser) => {
  // export is called by GET method and GET method doesn't have Content-type = "application/json" by design,
  // so in this case we have to explicitly parse the params
  scopeFilter = scopeFilter && JSON.parse(scopeFilter)

  const {
    inputs,
    globalCount,
    averageCount,
    profilesDistribution,
    actsWithSamePV,
    averageWithSamePV,
  } = await buildGlobalStatistics({ startDate, endDate, scopeFilter }, currentUser)

  const hospitals = await findListHospitals(scopeFilter)

  const workbook = new Excel.Workbook()

  workbook.created = now()
  workbook.modified = now()

  const actsWorksheet = workbook.addWorksheet("Statistiques globales")

  actsWorksheet.columns = [
    { header: "Statistique", key: "name", width: 40 },
    { header: "Valeur", key: "value", width: 20 },
  ]

  actsWorksheet.addRow({ name: "Nb actes au total", value: globalCount })
  actsWorksheet.addRow({ name: "Nb actes par jour en moyenne", value: averageCount })
  actsWorksheet.addRow({ name: "Nb actes portant le même n° de réquisition", value: actsWithSamePV })
  actsWorksheet.addRow({ name: "Moyenne des actes portant le même n° de réquisition", value: averageWithSamePV })

  actsWorksheet.addRow({})
  actsWorksheet.addRow({ name: "Nb actes vivants", value: profilesDistribution?.["Vivants (tous profils)"] })
  actsWorksheet.addRow({ name: "Nb actes personnes décédées", value: profilesDistribution?.["Personne décédée"] })
  actsWorksheet.addRow({ name: "Nb actes assises", value: profilesDistribution?.["Autre activité/Assises"] })
  actsWorksheet.addRow({
    name: "Nb actes reconstitutions",
    value: profilesDistribution?.["Autre activité/Reconstitution"],
  })

  const inputsWorksheet = workbook.addWorksheet("Paramètres de l'export")
  inputsWorksheet.columns = [
    { header: "Paramètre", key: "name", width: 40 },
    { header: "Valeur", key: "value", width: 80 },
  ]

  inputsWorksheet.addRow({ name: "Date de début", value: inputs?.startDate })
  inputsWorksheet.addRow({ name: "Date de fin", value: inputs?.endDate })
  inputsWorksheet.addRow({
    name: "Périmètre",
    value: inputs?.scopeFilter ? hospitals.map((elt) => elt?.name) : "National",
  })

  return workbook
}
