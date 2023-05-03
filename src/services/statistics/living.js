import Excel from "exceljs"

import knex from "../../knex/knex"
import { ISO_DATE, now } from "../../utils/date"
import { buildScope } from "../../utils/scope"
import { findList as findListHospitals } from "../hospitals"
import { addCellTitle, intervalDays, normalizeInputs } from "./common"

const makeWhereClause =
  ({ startDate, endDate, scopeFilter = [], profile }) =>
  (builder) => {
    builder
      .whereNull("deleted_at")
      .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate.format(ISO_DATE))
      .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate.format(ISO_DATE))

    if (scopeFilter.length) {
      builder.whereIn("hospital_id", scopeFilter)
    }
    if (profile) {
      builder.where("profile", profile)
    }
  }

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

  const { startDate, endDate, scopeFilter, profile } = normalizeInputs(filters, reachableScope)

  const fetchCountHospitals = knex("hospitals").whereNull("deleted_at").count()

  const fetchGlobalCount = knex("acts")
    .count()
    .where(makeWhereClause({ endDate, profile, scopeFilter, startDate }))
    .where((builder) => {
      builder.whereRaw(
        `profile <> 'Personne décédée' and profile <> 'Autre activité/Assises' and profile <> 'Autre activité/Reconstitution'`,
      )
    })

  const fetchActsWithPv = knex("acts")
    .select(
      knex.raw(
        `count(1) filter (where pv_number is not null and pv_number <> '')::integer as "Avec réquisition",` +
          `count(1) filter (where asker_id is null)::integer as "Recueil de preuve sans plainte",` +
          `count(1) filter (where pv_number is null or pv_number = '' )::integer as "Sans réquisition"`,
      ),
    )
    .where(makeWhereClause({ endDate, profile, scopeFilter, startDate }))

  const fetchActTypes = knex("acts")
    .select(
      knex.raw(
        `count(1) filter (where extra_data->'examinationTypes' @> '["Psychiatrique"]')::integer as "Psychiatrique",` +
          `count(1) filter (where extra_data->'examinationTypes' @> '["Somatique"]')::integer as "Somatique"`,
      ),
    )
    .where(makeWhereClause({ endDate, profile, scopeFilter, startDate }))

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
    .where((builder) => {
      if (scopeFilter.length) {
        builder.whereIn("hospital_id", scopeFilter)
      }
      if (profile) {
        builder.where("profile", profile)
      }
    })
    .where(makeWhereClause({ endDate, profile, scopeFilter, startDate }))

  const fetchHours = knex("acts")
    .select(
      knex.raw(
        `count(1) filter (where extra_data->'periodOfDay' <@ '["Matin", "Après-midi", "Journée"]')::integer as "Journée",` +
          `count(1) filter (where extra_data->>'periodOfDay' = 'Soirée')::integer as "Soirée",` +
          `count(1) filter (where extra_data->>'periodOfDay' = 'Nuit profonde')::integer as "Nuit profonde"`,
      ),
    )
    .where(makeWhereClause({ endDate, profile, scopeFilter, startDate }))

  return await Promise.all([
    fetchCountHospitals,
    fetchGlobalCount,
    // fetchAverageCount,
    fetchActsWithPv,
    fetchActTypes,
    fetchHours,
    fetchExaminations,
  ]).then(([[countHospitals], [globalCount], [actsWithPv], [actTypes], [hours], [examinations]]) => {
    countHospitals = parseInt(countHospitals?.count, 10) || 0
    globalCount = parseInt(globalCount?.count, 10) || 0

    const scopeFilterLength = scopeFilter.length || countHospitals
    const periodInDays = intervalDays({ endDate, startDate })

    return {
      actTypes,

      //averageCount && averageCount.length ? averageOf(averageCount.map((elt) => parseFloat(elt.avg, 10))) : 0,
      actsWithPv,

      averageCount:
        periodInDays === 0 || scopeFilterLength === 0 ? 0 : (globalCount / periodInDays / scopeFilterLength).toFixed(2),

      examinations,
      globalCount,
      hours,
      inputs: {
        endDate: endDate.format(ISO_DATE),
        profile,
        scopeFilter,
        startDate: startDate.format(ISO_DATE),
      },
    }
  })
}

export const exportLivingStatistics = async ({ startDate, endDate, scopeFilter, profile }, currentUser) => {
  scopeFilter = scopeFilter && scopeFilter.split(",").map(Number)
  const { inputs, globalCount, averageCount, actsWithPv, actTypes, hours, examinations } = await buildLivingStatistics(
    { endDate, profile, scopeFilter, startDate },
    currentUser,
  )

  const hospitals = await findListHospitals(scopeFilter)

  const workbook = new Excel.Workbook()

  workbook.created = now()
  workbook.modified = now()

  const actsWorksheet = workbook.addWorksheet("Statistiques vivants")

  actsWorksheet.columns = [
    { header: "Statistique", key: "name", width: 40 },
    { header: "Valeur", key: "value", width: 10 },
  ]

  actsWorksheet.getColumn("B").alignment = { horizontal: "right" }

  addCellTitle(actsWorksheet, "Actes réalisés")
  actsWorksheet.addRow({ name: "Nb actes au total", value: globalCount })
  actsWorksheet.addRow({ name: "Nb actes par jour en moyenne", value: averageCount })

  addCellTitle(actsWorksheet, "Numéro de réquisitions")
  actsWorksheet.addRow({ name: "Nb actes avec n° de réquisition", value: actsWithPv?.["Avec réquisition"] })
  actsWorksheet.addRow({ name: "Nb actes sans n° de réquisition", value: actsWithPv?.["Sans réquisition"] })
  actsWorksheet.addRow({
    name: "Nb actes avec recueil de preuves sans plainte",
    value: actsWithPv?.["Recueil de preuve sans plainte"],
  })

  addCellTitle(actsWorksheet, "Types d'actes")
  actsWorksheet.addRow({ name: "Nb actes avec examen somatique", value: actTypes?.["Somatique"] })
  actsWorksheet.addRow({ name: "Nb actes avec examen psychiatrique", value: actTypes?.["Psychiatrique"] })

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
  inputsWorksheet.addRow({ name: "Profil", value: inputs?.profile })

  return workbook
}
