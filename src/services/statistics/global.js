import Excel from "exceljs"

import knex from "../../knex/knex"
import { ISO_DATE, now } from "../../utils/date"
import { buildScope } from "../../utils/scope"
import { findList as findListHospitals } from "../hospitals"
import { addCellTitle, intervalDays, normalizeInputs } from "./common"

const makeWhereClause = ({ startDate, endDate, scopeFilter = [] }) => (builder) => {
  builder
    .whereNull("deleted_at")
    .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate.format(ISO_DATE))
    .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate.format(ISO_DATE))

  if (scopeFilter.length) {
    builder.whereIn("hospital_id", scopeFilter)
  }
}

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

  const fetchGlobalCount = knex("acts").count().where(makeWhereClause({ endDate, scopeFilter, startDate }))

  const fetchProfilesDistribution = knex("acts")
    .select(
      knex.raw(
        `count(1) filter (where profile not in ('Personne décédée', 'Autre activité/Assises', 'Autre activité/Reconstitution'))::integer as "Vivants",` +
          `count(1) filter (where profile = 'Personne décédée')::integer as "Personne décédée",` +
          `count(1) filter (where profile = 'Autre activité/Assises')::integer as "Autre activité/Assises",` +
          `count(1) filter (where profile = 'Autre activité/Reconstitution')::integer as "Autre activité/Reconstitution"`,
      ),
    )
    .where(makeWhereClause({ endDate, scopeFilter, startDate }))

  const fetchActsWithSamePV = knex
    .with("acts_with_same_pv", (builder) => {
      builder
        .select(knex.raw("pv_number, count(1) as count"))
        .from("acts")
        .where(makeWhereClause({ endDate, scopeFilter, startDate }))
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
        .where(makeWhereClause({ endDate, scopeFilter, startDate }))
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
  ]).then(([[countHospitals], [globalCount], [profilesDistribution], [actsWithSamePV], [averageWithSamePV]]) => {
    countHospitals = parseInt(countHospitals?.count, 10) || 0
    globalCount = parseInt(globalCount?.count, 10) || 0

    const scopeFilterLength = scopeFilter.length || countHospitals
    const periodInDays = intervalDays({ endDate, startDate })

    return {
      actsWithSamePV: actsWithSamePV.sum || 0,
      averageCount:
        periodInDays === 0 || scopeFilterLength === 0 ? 0 : (globalCount / periodInDays / scopeFilterLength).toFixed(2),
      averageWithSamePV: averageWithSamePV.avg || 0,

      globalCount,
      inputs: {
        endDate: endDate.format(ISO_DATE),
        scopeFilter,
        startDate: startDate.format(ISO_DATE),
      },
      profilesDistribution,
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
  } = await buildGlobalStatistics({ endDate, scopeFilter, startDate }, currentUser)

  const hospitals = await findListHospitals(scopeFilter)

  const workbook = new Excel.Workbook()

  workbook.created = now()
  workbook.modified = now()

  const actsWorksheet = workbook.addWorksheet("Statistiques globales")

  actsWorksheet.columns = [
    { header: "Statistique", key: "name", width: 40 },
    { header: "Valeur", key: "value", width: 10 },
  ]

  actsWorksheet.getColumn("B").alignment = { horizontal: "right" }

  addCellTitle(actsWorksheet, "Actes réalisés")

  actsWorksheet.addRow({ name: "Nb actes au total", value: globalCount })
  actsWorksheet.addRow({ name: "Nb actes par jour en moyenne", value: averageCount })
  actsWorksheet.addRow({ name: "Nb actes portant le même n° de réquisition", value: actsWithSamePV })
  actsWorksheet.addRow({ name: "Moyenne des actes portant le même n° de réquisition", value: averageWithSamePV })

  addCellTitle(actsWorksheet, "Répartition Vivant/Thanato")
  actsWorksheet.addRow({ name: "Nb actes vivants", value: profilesDistribution?.["Vivants"] })
  actsWorksheet.addRow({ name: "Nb actes personnes décédées", value: profilesDistribution?.["Personne décédée"] })

  addCellTitle(actsWorksheet, "Actes hors examens")
  actsWorksheet.addRow({
    name: "Nb actes reconstitutions",
    value: profilesDistribution?.["Autre activité/Reconstitution"],
  })
  actsWorksheet.addRow({ name: "Nb actes assises", value: profilesDistribution?.["Autre activité/Assises"] })

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
