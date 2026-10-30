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
  EXAMINATION_FIELDS_WITHOUT_ANAPATH,
  fetchExaminations,
  fetchStatistics,
  makeBaseWhereClause,
  normalizeInputs,
} from "./common"

const makeWhereClause = ({ startDate, endDate, scopeFilter = [], profile }) =>
  (builder) => {
    makeBaseWhereClause({ endDate, scopeFilter, startDate })(builder)

    if (profile) {
      builder.where("profile", profile)
    }
  }

const excludeDeceasedAndCourt = (builder) => {
  builder.whereRaw(
    `profile <> 'Personne décédée' and profile <> 'Autre activité/Assises' and profile <> 'Autre activité/Reconstitution'`,
  )
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

  const whereClause = makeWhereClause({ endDate, profile, scopeFilter, startDate })

  const fetchActTypesPromise = knex("acts")
    .select(
      knex.raw(
        `count(1) filter (where extra_data->'examinationTypes' @> '["Psychiatrique"]')::integer as "Psychiatrique",` +
        `count(1) filter (where extra_data->'examinationTypes' @> '["Somatique"]')::integer as "Somatique"`,
      ),
    )
    .where(whereClause)

  const fetchExaminationsPromise = fetchExaminations(knex, whereClause, EXAMINATION_FIELDS_WITHOUT_ANAPATH)

  return fetchStatistics(
    knex,
    whereClause,
    { endDate, profile, scopeFilter, startDate },
    { fetchActTypesPromise, fetchExaminationsPromise, globalCountFilter: excludeDeceasedAndCourt },
  )
}

export const exportLivingStatistics = async ({ startDate, endDate, scopeFilter, profile }, currentUser) => {
  scopeFilter = scopeFilter && scopeFilter.split(",").map(Number)
  const { inputs, globalCount, globalProofWitoutComplain, averageCount, actsWithPv, actTypes, hours, examinations } = await buildLivingStatistics(
    { endDate, profile, scopeFilter, startDate },
    currentUser,
  )

  const hospitals = await findListHospitals(scopeFilter)

  const { actsWorksheet, workbook } = createStatisticsWorkbook("Statistiques vivants")

  addActsRealisesSection(actsWorksheet, { averageCount, globalCount, globalProofWitoutComplain })
  addRequisitionsSection(actsWorksheet, actsWithPv)

  addCellTitle(actsWorksheet, "Types d'actes")
  actsWorksheet.addRow({ name: "Nb actes avec examen somatique", value: actTypes?.["Somatique"] })
  actsWorksheet.addRow({ name: "Nb actes avec examen psychiatrique", value: actTypes?.["Psychiatrique"] })

  addHoursSection(actsWorksheet, hours)

  addExaminationsSection(actsWorksheet, examinations, EXAMINATION_FIELDS_WITHOUT_ANAPATH)

  const inputsWorksheet = addInputsWorksheet(workbook, inputs, hospitals)
  inputsWorksheet.addRow({ name: "Profil", value: inputs?.profile })

  return workbook
}
