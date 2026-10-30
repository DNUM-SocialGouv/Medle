import knex from "../../knex/knex"
import { buildScope } from "../../utils/scope"
import { findList as findListHospitals } from "../hospitals"
import {
  addActsRealisesSection,
  addCellTitle,
  addExaminationsSection,
  addHoursSection,
  addInputsWorksheet,
  addRequisitionsSection,
  createStatisticsWorkbook,
  fetchExaminations,
  fetchStatistics,
  makeBaseWhereClause,
  normalizeInputs,
} from "./common"

const makeWhereClause = (filters) =>
  (builder) => {
    makeBaseWhereClause(filters)(builder)
    builder.where("profile", "Personne décédée")
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

  const whereClause = makeWhereClause({ endDate, scopeFilter, startDate })

  const fetchActTypesPromise = knex("acts")
    .select(
      knex.raw(
        `count(1) filter (where extra_data->'examinationTypes' @> '["Examen externe"]')::integer as "Examen externe",` +
        `count(1) filter (where extra_data->'examinationTypes' @> '["Levée de corps"]')::integer as "Levée de corps",` +
        `count(1) filter (where extra_data->'examinationTypes' @> '["Autopsie"]')::integer as "Autopsie",` +
        `count(1) filter (where extra_data->'examinationTypes' @> '["Anthropologie"]')::integer as "Anthropologie",` +
        `count(1) filter (where extra_data->'examinationTypes' @> '["Odontologie"]')::integer as "Odontologie"`,
      ),
    )
    .where(whereClause)

  const fetchExaminationsPromise = fetchExaminations(knex, whereClause)

  return fetchStatistics(knex, whereClause, { endDate, scopeFilter, startDate }, { fetchActTypesPromise, fetchExaminationsPromise })
}

export const exportDeceasedStatistics = async ({ startDate, endDate, scopeFilter }, currentUser) => {
  scopeFilter = scopeFilter && scopeFilter.split(",").map(Number)

  const { inputs, globalCount, globalProofWitoutComplain, averageCount, actsWithPv, actTypes, hours, examinations } =
    await buildDeceasedStatistics({ endDate, scopeFilter, startDate }, currentUser)

  const hospitals = await findListHospitals(scopeFilter)

  const { actsWorksheet, workbook } = createStatisticsWorkbook("Statistiques thanato")

  addActsRealisesSection(actsWorksheet, { averageCount, globalCount, globalProofWitoutComplain })
  addRequisitionsSection(actsWorksheet, actsWithPv)

  addCellTitle(actsWorksheet, "Types d'actes")

  actsWorksheet.addRow({ name: "Nb actes avec examen externe", value: actTypes?.["Examen externe"] })
  actsWorksheet.addRow({ name: "Nb actes avec levée de corps", value: actTypes?.["Levée de corps"] })
  actsWorksheet.addRow({ name: "Nb actes avec autopsie", value: actTypes?.["Autopsie"] })
  actsWorksheet.addRow({ name: "Nb actes avec anthropologie", value: actTypes?.["Anthropologie"] })
  actsWorksheet.addRow({ name: "Nb actes avec odontologie", value: actTypes?.["Odontologie"] })

  addHoursSection(actsWorksheet, hours)

  addExaminationsSection(actsWorksheet, examinations)

  addInputsWorksheet(workbook, inputs, hospitals)

  return workbook
}
