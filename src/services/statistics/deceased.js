import Excel from "exceljs"

import knex from "../../knex/knex"
import { ISO_DATE, now } from "../../utils/date"
import { normalizeInputs, intervalDays } from "./common"
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
    .where("profile", "Personne décédée")
    .count()

  return await Promise.all([fetchCountHospitals, fetchGlobalCount]).then(([[countHospitals], [globalCount]]) => {
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
