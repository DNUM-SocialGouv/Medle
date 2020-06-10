import Excel from "exceljs"

import knex from "../../knex/knex"
import { ISO_DATE, now } from "../../utils/date"
import { normalizeInputs, intervalDays } from "./common"
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

  const fetchCountHospitals = knex("hospitals").whereNull("deleted_at").count()

  const fetchGlobalCount = knex("acts")
    .whereNull("deleted_at")
    .where((builder) => {
      if (scopeFilter.length) {
        builder.whereIn("hospital_id", scopeFilter)
      }
    })
    .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate.format(ISO_DATE))
    .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate.format(ISO_DATE))
    .count()

  const fetchProfilesDistribution = knex("acts")
    .select(
      knex.raw(
        "case when profile not in ('Personne décédée', 'Autre activité/Assises', 'Autre activité/Reconstitution') " +
          "then 'Vivants (tous profils)' " +
          "else profile end as type, " +
          "count(*)::integer"
      )
    )
    .whereNull("deleted_at")
    .where((builder) => {
      if (scopeFilter.length) {
        builder.whereIn("hospital_id", scopeFilter)
      }
    })
    .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate.format(ISO_DATE))
    .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate.format(ISO_DATE))
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
        .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate.format(ISO_DATE))
        .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate.format(ISO_DATE))
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
        .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate.format(ISO_DATE))
        .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate.format(ISO_DATE))
        .whereRaw("pv_number is not null and pv_number <> ''")
        .groupBy("pv_number")
    })
    .select(knex.raw("avg(count)::integer"))
    .from("acts_with_same_pv")

  return await Promise.all([
    fetchCountHospitals,
    fetchGlobalCount,
    fetchProfilesDistribution,
    fetchActsWithSamePV,
    fetchAverageWithSamePV,
  ]).then(([[countHospitals], [globalCount], profilesDistribution, [actsWithSamePV], [averageWithSamePV]]) => {
    console.log("buildGlobalStatistics -> profilesDistribution", profilesDistribution)

    countHospitals = parseInt(countHospitals?.count, 10) || 0
    globalCount = parseInt(globalCount?.count, 10) || 0

    const scopeFilterLength = scopeFilter.length || countHospitals
    const periodInDays = intervalDays({ startDate, endDate })

    return {
      inputs: {
        startDate: startDate.format(ISO_DATE),
        endDate: endDate.format(ISO_DATE),
        scopeFilter,
      },
      globalCount,
      averageCount:
        periodInDays === 0 || scopeFilterLength === 0 ? 0 : (globalCount / periodInDays / scopeFilterLength).toFixed(2),

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
