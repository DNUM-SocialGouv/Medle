import Excel from "exceljs"

import knex from "../../knex/knex"
import { ISO_DATE, now } from "../../utils/date"
import { normalizeInputs, averageOf } from "./common"
import { buildScope } from "../scope"
import { findList as findListHospitals } from "../hospitals"

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
    .where((builder) => {
      if (scopeFilter.length) {
        builder.whereIn("hospital_id", scopeFilter)
      }
    })
    .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
    .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
    .whereRaw(`profile = 'Personne décédée'`)

  const fetchAverageCount = knex
    .from(knex.raw(`avg_acts('${startDate}', '${endDate}')`))
    .where((builder) => {
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
      averageCount: averageCount?.length ? averageOf(averageCount.map((elt) => parseFloat(elt.avg, 10))) : 0,
    }
  })
}

export const exportDeceasedStatistics = async ({ startDate, endDate, scopeFilter }, currentUser) => {
  scopeFilter = scopeFilter && JSON.parse(scopeFilter)

  const { inputs, globalCount, averageCount } = await buildDeceasedStatistics(
    { startDate, endDate, scopeFilter },
    currentUser
  )

  const hospitals = await findListHospitals(scopeFilter)

  const workbook = new Excel.Workbook()

  workbook.created = now()
  workbook.modified = now()

  const actsWorksheet = workbook.addWorksheet("Statistiques thanato")

  actsWorksheet.columns = [
    { header: "Statistique", key: "name", width: 40 },
    { header: "Valeur", key: "value", width: 20 },
  ]

  actsWorksheet.addRow({ name: "Nb actes au total", value: globalCount })
  actsWorksheet.addRow({ name: "Nb actes par jour en moyenne", value: averageCount })

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
