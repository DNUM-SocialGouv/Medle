import * as yup from "yup"

import { LIMIT_EXPORT } from "../../config"
import knex from "../../knex/knex"
import { transformAll, transformAllForExport } from "../../models/acts"
import { normalize } from "../normalize"
import { APIError } from "../../utils/errors"
import { STATUS_406_NOT_ACCEPTABLE } from "../../utils/http"

const LIMIT = 50

export const makeWhereClause = ({
  scope,
  hospitals,
}) => (builder) => {
  let queriedHospitals = []

  if (hospitals?.length) {
    // For valid hospital filter, filter on it
    queriedHospitals = hospitals
  } else if (scope?.length) {
    // Otherwise, for scoped user, filter on his scope
    queriedHospitals = scope
  }
  // Otherwise, do not filter at all

  if (queriedHospitals?.length) {
    builder.where(
      knex.raw("act_summary.hospital_id in (" + queriedHospitals.map(() => "?").join(",") + ")", [...queriedHospitals]),
    )
  }
}

const searchSchema = yup.object().shape({
  currentUser: yup.object(),
  hospitals: yup.array().of(yup.number().positive().integer()),
  requestedPage: yup.number().integer().positive(),
})

export const normalizeParams = async (params, currentUser) => {
  // Wrap supposed array fields with array litteral syntax for yup try to cast
  params.hospitals = params.hospitals ? params.hospitals.split(",").map(Number) : []
  params.scope = currentUser?.scope || []
  if (currentUser?.hospital?.id) params.scope = [...params.scope, currentUser.hospital.id]

  // For user having a scope (non super admin, non national user), then restrict potentially their hospital filter
  if (params.hospitals?.length && params.scope?.length) {
    params.hospitals = params.hospitals.filter((hospital) => params.scope.includes(hospital))
  }

  return normalize(searchSchema)(params)
}

export const search = async (params, currentUser) => {
  params = await normalizeParams(params, currentUser)
  const [actsCount] = await knex("act_summary").where(makeWhereClause(params)).count()

  const totalCount = parseInt(actsCount.count, 10)
  const maxPage = Math.ceil(totalCount / LIMIT)

  let { requestedPage } = params

  // set default to 1 if not correct or too little, set default to maxPage if too big
  requestedPage =
    !requestedPage || isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage > maxPage ? maxPage : requestedPage

  const offset = (requestedPage - 1) * LIMIT

  // SQL query
  const actsSummary = await knex("act_summary")
    .where(makeWhereClause(params))
    .limit(LIMIT)
    .offset(offset)
    .select("*")

  return { byPage: LIMIT, currentPage: requestedPage, elements: actsSummary, maxPage, totalCount }
}

// export const searchForExport = async (params, currentUser) => {
//   params = await normalizeParams(params, currentUser)

//   const [actsCount] = await knex("acts").where(makeWhereClause(params)).count()

//   const count = actsCount?.count

//   // Limit the number of lines in export feature for security reason.
//   if (count && count > LIMIT_EXPORT)
//     throw new APIError({
//       message: `Too many rows (limit is ${LIMIT_EXPORT})`,
//       status: STATUS_406_NOT_ACCEPTABLE,
//     })

//   // SQL query
//   const acts = await knex("acts")
//     .leftJoin("askers", "acts.asker_id", "askers.id")
//     .join("hospitals", "acts.hospital_id", "hospitals.id")
//     .join("users", "acts.added_by", "users.id")
//     .where(makeWhereClause(params))
//     .orderByRaw(
//       "acts.examination_date desc, case when (acts.updated_at is not null) then acts.updated_at else acts.created_at end desc",
//     )
//     .select([
//       "acts.*",
//       "askers.name as asker_name",
//       "hospitals.name as hospital_name",
//       "users.email as user_email",
//       "users.first_name as user_first_name",
//       "users.last_name as user_last_name",
//     ])

//   return { elements: transformAllForExport(acts), totalCount: count }
// }
