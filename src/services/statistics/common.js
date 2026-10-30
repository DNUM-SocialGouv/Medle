import Excel from "exceljs"
import moment from "moment"

import { livingProfiles } from "../../utils/actsConstants"
import { ISO_DATE, now } from "../../utils/date"
import { logError } from "../../utils/logger"

const defaultEndDate = () => now()

// warning: function used by statistics page as well
export const isValidEndDate = (endDate) => {
  endDate = moment(endDate, ISO_DATE, true)
  return endDate.isValid() && endDate.isSameOrBefore(now())
}

// warning: function used by statistics page as well
export const isValidStartDate = (startDate, endDate) => {
  startDate = moment(startDate, ISO_DATE, true)
  return startDate.isValid() && startDate.isSameOrBefore(endDate)
}
export const normalizeDates = ({ startDate, endDate } = {}) => {
  endDate = moment(endDate, ISO_DATE, true).endOf("day")
  startDate = moment(startDate, ISO_DATE, true).startOf("day")

  // end date must be not null, well formatted and not in the future
  endDate = isValidEndDate(endDate) ? endDate : defaultEndDate()

  // get start date thrown if well formated and before end date, get 1st january of the year of end date if not
  startDate = isValidStartDate(startDate, endDate) ? startDate : endDate

  return { startDate, endDate }
}

export const normalizeInputs = ({ startDate, endDate, scopeFilter = [], profile }, reachableScope) => {
  // reachableScope.length == 0 if super addmin or public supervisor, with rights to see all hospitals
  if (reachableScope.length !== 0) {
    // check if all the scope filter is included in the reachable scope
    for (let i = 0; i < scopeFilter.length; i++) {
      if (!reachableScope.includes(scopeFilter[i])) {
        scopeFilter = []
        break
      }
    }
  }

  return {
    ...normalizeDates({ startDate, endDate }),
    scopeFilter,
    profile: livingProfiles.map((profile) => profile.value).includes(profile) ? profile : "",
  }
}

export const averageOf = (arr) => {
  if (!arr?.length) return 0
  const sum = arr.reduce((acc, curr) => acc + curr)
  return Number.parseFloat((sum / arr.length).toFixed(2), 10)
}

export const intervalDays = ({ startDate = now(), endDate = now() }) => {
  if (!moment.isMoment(endDate) || !moment.isMoment(startDate)) {
    logError("The dates are not in moment format")
    return 0
  }
  return endDate.diff(startDate, "days") + 1
}

export const addCellTitle = (actsWorksheet, title) => {
  actsWorksheet.addRow({})
  const row = actsWorksheet.addRow({ name: title })
  row.font = { bold: true }
}

// Shared date/scope part of the "where" clause used by deceased/living/global statistics.
// Specific profile filtering is applied on top by each caller.
export const makeBaseWhereClause =
  ({ startDate, endDate, scopeFilter = [] }) =>
    (builder) => {
      builder
        .whereNull("deleted_at")
        .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate.format(ISO_DATE))
        .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate.format(ISO_DATE))

      if (scopeFilter.length) {
        builder.whereIn("hospital_id", scopeFilter)
      }
    }

export const fetchCountHospitals = (knex) => knex("hospitals").whereNull("deleted_at").count()

export const fetchGlobalCount = (knex, whereClause) => knex("acts").count().where(whereClause)

export const fetchGlobalProofWitoutComplain = (knex, whereClause) =>
  knex("acts")
    .count()
    .whereRaw("(extra_data->>'proofWithoutComplaint')::boolean = true")
    .where(whereClause)

export const fetchActsWithPv = (knex, whereClause) =>
  knex("acts")
    .select(
      knex.raw(
        `count(1) filter (where pv_number is not null and pv_number <> '')::integer as "Avec réquisition",` +
        `count(1) filter (where asker_id is null)::integer as "Recueil de preuve sans plainte",` +
        `count(1) filter (where pv_number is null or pv_number = '' )::integer as "Sans réquisition"`,
      ),
    )
    .where(whereClause)

export const fetchHours = (knex, whereClause) =>
  knex("acts")
    .select(
      knex.raw(
        `count(1) filter (where extra_data->'periodOfDay' <@ '["Matin", "Après-midi", "Journée"]')::integer as "Journée",` +
        `count(1) filter (where extra_data->>'periodOfDay' = 'Soirée')::integer as "Soirée",` +
        `count(1) filter (where extra_data->>'periodOfDay' = 'Nuit profonde')::integer as "Nuit profonde"`,
      ),
    )
    .where(whereClause)

export const computeAverageCount = ({ globalCount, scopeFilter, countHospitals, periodInDays }) => {
  const scopeFilterLength = scopeFilter.length || countHospitals
  return periodInDays === 0 || scopeFilterLength === 0 ? "0.00" : (globalCount / periodInDays / scopeFilterLength).toFixed(2)
}

// All the possible "examinations" columns, shared by deceased/living statistics.
// Deceased statistics include the "Anapath" column, living statistics do not.
export const EXAMINATION_FIELDS_WITH_ANAPATH = ["Biologie", "Imagerie", "Toxicologie", "Anapath", "Génétique", "Autres"]
export const EXAMINATION_FIELDS_WITHOUT_ANAPATH = ["Biologie", "Imagerie", "Toxicologie", "Génétique", "Autres"]

const EXAMINATION_LABELS = {
  Autres: "Nb actes mentionnant autres",
  Anapath: "Nb actes mentionnant anapath",
  Biologie: "Nb actes mentionnant biologie",
  Génétique: "Nb actes mentionnant génétique",
  Imagerie: "Nb actes mentionnant imagerie",
  Toxicologie: "Nb actes mentionnant toxicologie",
}

export const fetchExaminations = (knex, whereClause, fields = EXAMINATION_FIELDS_WITH_ANAPATH) =>
  knex("acts")
    .select(
      knex.raw(
        fields
          .map((field) => `count(1) filter (where extra_data->'examinations' @> '["${field}"]')::integer as "${field}"`)
          .join(","),
      ),
    )
    .where(whereClause)

export const addExaminationsSection = (actsWorksheet, examinations, fields = EXAMINATION_FIELDS_WITH_ANAPATH) => {
  addCellTitle(actsWorksheet, "Examens complémentaires")
  fields.forEach((field) => {
    actsWorksheet.addRow({ name: EXAMINATION_LABELS[field], value: examinations?.[field] })
  })
}

/**
 * Fetch and format the common part of the deceased/living statistics: global counts, hours,
 * acts with pv and examinations, combined with the act-types promise specific to each caller.
 *
 * @param {*} knex
 * @param {*} whereClause base where clause (date range, scope, profile...)
 * @param {*} filters ex: {startDate, endDate, scopeFilter, profile}
 * @param {*} options {fetchActTypesPromise, fetchExaminationsPromise, globalCountFilter}
 *   - fetchActTypesPromise: query promise computing the act types specific to the caller
 *   - fetchExaminationsPromise: query promise computing the examinations (see fetchExaminations)
 *   - globalCountFilter: optional extra filter applied on top of the global count queries
 *
 * @return object with shape: { inputs, globalCount, averageCount, actsWithPv, actTypes, hours, examinations }
 */
export const fetchStatistics = async (
  knex,
  whereClause,
  { startDate, endDate, scopeFilter, profile },
  { fetchActTypesPromise, fetchExaminationsPromise, globalCountFilter },
) => {
  const fetchCountHospitalsPromise = fetchCountHospitals(knex)

  let fetchGlobalCountPromise = fetchGlobalCount(knex, whereClause)
  let fetchGlobalProofWitoutComplainPromise = fetchGlobalProofWitoutComplain(knex, whereClause)

  if (globalCountFilter) {
    fetchGlobalCountPromise = fetchGlobalCountPromise.where(globalCountFilter)
    fetchGlobalProofWitoutComplainPromise = fetchGlobalProofWitoutComplainPromise.where(globalCountFilter)
  }

  const fetchActsWithPvPromise = fetchActsWithPv(knex, whereClause)
  const fetchHoursPromise = fetchHours(knex, whereClause)

  const [[countHospitals], [globalCount], [globalProofWitoutComplain], [actsWithPv], [actTypes], [hours], [examinations]] =
    await Promise.all([
      fetchCountHospitalsPromise,
      fetchGlobalCountPromise,
      fetchGlobalProofWitoutComplainPromise,
      fetchActsWithPvPromise,
      fetchActTypesPromise,
      fetchHoursPromise,
      fetchExaminationsPromise,
    ])

  const normalizedCountHospitals = Number.parseInt(countHospitals?.count, 10) || 0
  const normalizedGlobalCount = Number.parseInt(globalCount?.count, 10) || 0
  const periodInDays = intervalDays({ endDate, startDate })

  return {
    actTypes,
    actsWithPv,
    averageCount: computeAverageCount({
      countHospitals: normalizedCountHospitals,
      globalCount: normalizedGlobalCount,
      periodInDays,
      scopeFilter,
    }),
    examinations,
    globalCount: normalizedGlobalCount,
    globalProofWitoutComplain: Number.parseInt(globalProofWitoutComplain?.count, 10) || 0,
    hours,
    inputs: {
      endDate: endDate.format(ISO_DATE),
      ...(profile === undefined ? {} : { profile }),
      scopeFilter,
      startDate: startDate.format(ISO_DATE),
    },
  }
}

export const createStatisticsWorkbook = (sheetName) => {
  const workbook = new Excel.Workbook()

  workbook.created = now()
  workbook.modified = now()

  const actsWorksheet = workbook.addWorksheet(sheetName)

  actsWorksheet.columns = [
    { header: "Statistique", key: "name", width: 40 },
    { header: "Valeur", key: "value", width: 10 },
  ]

  actsWorksheet.getColumn("B").alignment = { horizontal: "right" }

  return { actsWorksheet, workbook }
}

export const addActsRealisesSection = (actsWorksheet, { globalCount, globalProofWitoutComplain, averageCount }) => {
  addCellTitle(actsWorksheet, "Actes réalisés")

  actsWorksheet.addRow({ name: "Nb actes au total", value: globalCount })
  actsWorksheet.addRow({ name: "Recueil de preuve sans plainte", value: globalProofWitoutComplain })
  const avgRow = actsWorksheet.addRow({ name: "Nb actes par jour en moyenne", value: averageCount })
  avgRow.getCell("value").alignment = { horizontal: "right" }
}

export const addRequisitionsSection = (actsWorksheet, actsWithPv) => {
  addCellTitle(actsWorksheet, "Numéro de réquisitions")

  actsWorksheet.addRow({ name: "Nb actes avec n° de réquisition", value: actsWithPv?.["Avec réquisition"] })
  actsWorksheet.addRow({ name: "Nb actes sans n° de réquisition", value: actsWithPv?.["Sans réquisition"] })
  actsWorksheet.addRow({
    name: "Nb actes avec recueil de preuves sans plainte",
    value: actsWithPv?.["Recueil de preuve sans plainte"],
  })
}

export const addHoursSection = (actsWorksheet, hours) => {
  addCellTitle(actsWorksheet, "Horaires")
  actsWorksheet.addRow({ name: "Nb actes en journées", value: hours?.["Journée"] })
  actsWorksheet.addRow({ name: "Nb actes en soirée", value: hours?.["Soirée"] })
  actsWorksheet.addRow({ name: "Nb actes en nuit profonde", value: hours?.["Nuit profonde"] })
}

export const addInputsWorksheet = (workbook, inputs, hospitals) => {
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

  return inputsWorksheet
}
