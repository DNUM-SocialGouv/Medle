import Excel from "exceljs"

import knex from "../../knex/knex"
import { ISO_DATE, now } from "../../utils/date"
import { findList as findListHospitals } from "../hospitals"
import { buildScope } from "../scope"
import { addCellTitle, intervalDays, normalizeInputs } from "./common"

const makeWhereClause = ({ startDate, endDate, scopeFilter = [] }) => (builder) => {
  builder
    .whereNull("deleted_at")
    .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate.format(ISO_DATE))
    .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate.format(ISO_DATE))
    .where("profile", "Personne décédée")

  if (scopeFilter.length) {
    builder.whereIn("hospital_id", scopeFilter)
  }
}

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

  const fetchGlobalCount = knex("acts").count().where(makeWhereClause({ startDate, endDate, scopeFilter }))

  const fetchActsWithPv = knex("acts")
    .select(
      knex.raw(
        `count(1) filter (where pv_number is not null and pv_number <> '')::integer as "Avec réquisition",` +
          `count(1) filter (where asker_id is null)::integer as "Recueil de preuve sans plainte",` +
          `count(1) filter (where pv_number is null or pv_number = '' )::integer as "Sans réquisition"`
      )
    )
    .where(makeWhereClause({ startDate, endDate, scopeFilter }))

  const fetchActTypes = knex("acts")
    .select(
      knex.raw(
        `count(1) filter (where extra_data->'examinationTypes' @> '["Examen externe"]')::integer as "Examen externe",` +
          `count(1) filter (where extra_data->'examinationTypes' @> '["Levée de corps"]')::integer as "Levée de corps",` +
          `count(1) filter (where extra_data->'examinationTypes' @> '["Autopsie"]')::integer as "Autopsie",` +
          `count(1) filter (where extra_data->'examinationTypes' @> '["Anthropologie"]')::integer as "Anthropologie",` +
          `count(1) filter (where extra_data->'examinationTypes' @> '["Odontologie"]')::integer as "Odontologie"`
      )
    )
    .where(makeWhereClause({ startDate, endDate, scopeFilter }))

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
    .where(makeWhereClause({ startDate, endDate, scopeFilter }))

  const fetchHours = knex("acts")
    .whereNull("deleted_at")
    .select(
      knex.raw(
        `count(1) filter (where extra_data->'periodOfDay' <@ '["Matin", "Après-midi", "Journée"]')::integer as "Journée",` +
          `count(1) filter (where extra_data->>'periodOfDay' = 'Soirée')::integer as "Soirée",` +
          `count(1) filter (where extra_data->>'periodOfDay' = 'Nuit profonde')::integer as "Nuit profonde"`
      )
    )
    .where(makeWhereClause({ startDate, endDate, scopeFilter }))

  return await Promise.all([
    fetchCountHospitals,
    fetchGlobalCount,
    fetchActsWithPv,
    fetchActTypes,
    fetchHours,
    fetchExaminations,
  ]).then(([[countHospitals], [globalCount], [actsWithPv], [actTypes], [hours], [examinations]]) => {
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
      actsWithPv,
      actTypes,
      hours,
      examinations,
    }
  })
}

export const exportDeceasedStatistics = async ({ startDate, endDate, scopeFilter }, currentUser) => {
  scopeFilter = scopeFilter && JSON.parse(scopeFilter)

  const {
    inputs,
    globalCount,
    averageCount,
    actsWithPv,
    actTypes,
    hours,
    examinations,
  } = await buildDeceasedStatistics({ startDate, endDate, scopeFilter }, currentUser)

  const hospitals = await findListHospitals(scopeFilter)

  const workbook = new Excel.Workbook()

  workbook.created = now()
  workbook.modified = now()

  const actsWorksheet = workbook.addWorksheet("Statistiques thanato")

  actsWorksheet.columns = [
    { header: "Statistique", key: "name", width: 40 },
    { header: "Valeur", key: "value", width: 10 },
  ]

  actsWorksheet.getColumn("B").alignment = { horizontal: "right" }

  addCellTitle(actsWorksheet, "Actes réalisés")

  actsWorksheet.addRow({ name: "Nb actes au total", value: globalCount })
  const avgRow = actsWorksheet.addRow({ name: "Nb actes par jour en moyenne", value: averageCount })
  avgRow.getCell("value").alignment = { horizontal: "right" }

  addCellTitle(actsWorksheet, "Numéro de réquisitions")

  actsWorksheet.addRow({ name: "Nb actes avec n° de réquisition", value: actsWithPv?.["Avec réquisition"] })
  actsWorksheet.addRow({ name: "Nb actes sans n° de réquisition", value: actsWithPv?.["Sans réquisition"] })
  actsWorksheet.addRow({
    name: "Nb actes avec recueil de preuves sans plainte",
    value: actsWithPv?.["Recueil de preuve sans plainte"],
  })

  addCellTitle(actsWorksheet, "Types d'actes")

  actsWorksheet.addRow({ name: "Nb actes avec examen externe", value: actTypes?.["Examen externe"] })
  actsWorksheet.addRow({ name: "Nb actes avec levée de corps", value: actTypes?.["Levée de corps"] })
  actsWorksheet.addRow({ name: "Nb actes avec autopsie", value: actTypes?.["Autopsie"] })
  actsWorksheet.addRow({ name: "Nb actes avec anthropologie", value: actTypes?.["Anthropologie"] })
  actsWorksheet.addRow({ name: "Nb actes avec odontologie", value: actTypes?.["Odontologie"] })

  addCellTitle(actsWorksheet, "Horaires")
  actsWorksheet.addRow({ name: "Nb actes en journées", value: hours?.["Journée"] })
  actsWorksheet.addRow({ name: "Nb actes en soirée", value: hours?.["Soirée"] })
  actsWorksheet.addRow({ name: "Nb actes en nuit profonde", value: hours?.["Nuit profonde"] })

  addCellTitle(actsWorksheet, "Examens complémentaires")
  actsWorksheet.addRow({ name: "Nb actes mentionnant biologie", value: examinations?.["Biologie"] })
  actsWorksheet.addRow({ name: "Nb actes mentionnant imagerie", value: examinations?.["Imagerie"] })
  actsWorksheet.addRow({ name: "Nb actes mentionnant toxicologie", value: examinations?.["Toxicologie"] })
  actsWorksheet.addRow({ name: "Nb actes mentionnant anapath", value: examinations?.["Anapath"] })
  actsWorksheet.addRow({ name: "Nb actes mentionnant génétique", value: examinations?.["Génétique"] })
  actsWorksheet.addRow({ name: "Nb actes mentionnant autres", value: examinations?.["Autres"] })

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
