import knex from "../../knex/knex"
import { ISO_DATE } from "../../utils/date"
import { buildScope } from "../../utils/scope"
import { findList as findListHospitals } from "../hospitals"
import {
  addActsRealisesSection,
  addCellTitle,
  addInputsWorksheet,
  computeAverageCount,
  createStatisticsWorkbook,
  fetchCountHospitals,
  fetchGlobalCount,
  fetchGlobalProofWitoutComplain,
  intervalDays,
  makeBaseWhereClause,
  normalizeInputs,
} from "./common"

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

  const whereClause = makeBaseWhereClause({ endDate, scopeFilter, startDate })

  const fetchCountHospitalsPromise = fetchCountHospitals(knex)
  const fetchGlobalCountPromise = fetchGlobalCount(knex, whereClause)
  const fetchGlobalProofWitoutComplainPromise = fetchGlobalProofWitoutComplain(knex, whereClause)

  const fetchProfilesDistribution = knex("acts")
    .select(
      knex.raw(
        `count(1) filter (where profile not in ('Personne décédée', 'Autre activité/Assises', 'Autre activité/Reconstitution'))::integer as "Vivants",` +
        `count(1) filter (where profile = 'Personne décédée')::integer as "Personne décédée",` +
        `count(1) filter (where profile = 'Autre activité/Assises')::integer as "Autre activité/Assises",` +
        `count(1) filter (where profile = 'Autre activité/Reconstitution')::integer as "Autre activité/Reconstitution"`,
      ),
    )
    .where(whereClause)

  const fetchActsWithSamePV = knex
    .with("acts_with_same_pv", (builder) => {
      builder
        .select(knex.raw("pv_number, count(1) as count"))
        .from("acts")
        .where(whereClause)
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
        .where(whereClause)
        .whereRaw("pv_number is not null and pv_number <> ''")
        .groupBy("pv_number")
    })
    .select(knex.raw("avg(count)::integer"))
    .from("acts_with_same_pv")

  return await Promise.all([
    fetchCountHospitalsPromise,
    fetchGlobalCountPromise,
    fetchGlobalProofWitoutComplainPromise,
    fetchProfilesDistribution,
    fetchActsWithSamePV,
    fetchAverageWithSamePV,
  ]).then(([[countHospitals], [globalCount], [globalProofWitoutComplain], [profilesDistribution], [actsWithSamePV], [averageWithSamePV]]) => {
    countHospitals = Number.parseInt(countHospitals?.count, 10) || 0
    globalCount = Number.parseInt(globalCount?.count, 10) || 0

    const periodInDays = intervalDays({ endDate, startDate })

    return {
      actsWithSamePV: actsWithSamePV.sum || 0,
      averageCount: computeAverageCount({ countHospitals, globalCount, periodInDays, scopeFilter }),
      averageWithSamePV: averageWithSamePV.avg || 0,

      globalCount,
      globalProofWitoutComplain: Number.parseInt(globalProofWitoutComplain?.count, 10) || 0,
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
  scopeFilter = scopeFilter && scopeFilter.split(",").map(Number)

  const { inputs, globalCount, globalProofWitoutComplain, averageCount, profilesDistribution, actsWithSamePV, averageWithSamePV } =
    await buildGlobalStatistics({ endDate, scopeFilter, startDate }, currentUser)

  const hospitals = await findListHospitals(scopeFilter)

  const { actsWorksheet, workbook } = createStatisticsWorkbook("Statistiques globales")

  addActsRealisesSection(actsWorksheet, { averageCount, globalCount, globalProofWitoutComplain })
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

  addInputsWorksheet(workbook, inputs, hospitals)

  return workbook
}
