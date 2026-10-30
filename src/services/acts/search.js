import * as yup from "yup"

import { LIMIT_EXPORT } from "../../config"
import knex from "../../knex/knex"
import { transformAll, transformAllForExport } from "../../models/acts"
import { normalize } from "../../services/normalize"
import { computeRequestedPage, makeHospitalFilter, normalizeHospitalsAndScope } from "../search-helpers"
import { ISO_DATE, isValidIsoDate } from "../../utils/date"
import { APIError } from "../../utils/errors"
import { STATUS_406_NOT_ACCEPTABLE } from "../../utils/http"
import { normalizeKeepCase } from "normalize-diacritics-es"

const LIMIT = 50

const makeHospitalIdFilter = makeHospitalFilter("acts.hospital_id")

export const makeWhereClause = (params) => (builder) => {
  const { startDate, endDate, internalNumber, pvNumber, fuzzy, asker, profiles } = params

  builder.whereNull("acts.deleted_at")

  makeHospitalIdFilter(params)(builder)

  if (startDate) {
    builder.whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
  }
  if (endDate) {
    builder.whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
  }
  if (internalNumber) {
    builder.where("internal_number", internalNumber)
  }

  if (asker) {
    builder.where("acts.asker_id", asker)
  }

  if (profiles?.length) {
    builder.where(knex.raw("profile in (" + profiles.map(() => "?").join(",") + ")", [...profiles]))
  }

  if (pvNumber) {
    builder.where("pv_number", pvNumber)
  }

  if (fuzzy) {
    builder.where(function () {
      this.whereRaw(`unaccent(internal_number) ILIKE ?`, [`%${normalizeKeepCase(fuzzy)}%`])
        .orWhereRaw(`unaccent(pv_number) ILIKE ?`, [`%${normalizeKeepCase(fuzzy)}%`])
        .orWhereRaw(`unaccent(profile) ILIKE ?`, [`%${normalizeKeepCase(fuzzy)}%`])
    })
  }
}

const searchSchema = yup.object().shape({
  asker: yup.number().integer().positive(),
  currentUser: yup.object(),
  endDate: yup.string().transform((value, originalValue) => (isValidIsoDate(value) ? originalValue : null)),
  fuzzy: yup.string(),
  hospitals: yup.array().of(yup.number().positive().integer()),
  internalNumber: yup.string(),
  profiles: yup.array(),
  pvNumber: yup.string(),
  requestedPage: yup.number().integer().positive(),
  startDate: yup.string().transform((value, originalValue) => (isValidIsoDate(value) ? originalValue : null)),
})

export const normalizeParams = async (params, currentUser) => {
  // Wrap supposed array fields with array litteral syntax for yup try to cast
  params.profiles = params.profiles ? params.profiles.split(",") : []
  normalizeHospitalsAndScope(params, currentUser)

  return normalize(searchSchema)(params)
}

export const search = async (params, currentUser) => {
  params = await normalizeParams(params, currentUser)

  const [actsCount] = await knex("acts").where(makeWhereClause(params)).count()

  const totalCount = Number.parseInt(actsCount.count, 10)
  const { maxPage, offset, page: requestedPage } = computeRequestedPage(params.requestedPage, totalCount, LIMIT)

  // SQL query
  const acts = await knex("acts")
    .where(makeWhereClause(params))
    .orderByRaw(
      "acts.examination_date desc, case when (acts.updated_at is not null) then acts.updated_at else acts.created_at end desc",
    )
    .limit(LIMIT)
    .offset(offset)
    .select("*")

  return { byPage: LIMIT, currentPage: requestedPage, elements: transformAll(acts), maxPage, totalCount }
}

export const searchForExport = async (params, currentUser) => {
  params = await normalizeParams(params, currentUser)

  const [actsCount] = await knex("acts").where(makeWhereClause(params)).count()

  const count = actsCount?.count

  // Limit the number of lines in export feature for security reason.
  if (count && count > LIMIT_EXPORT)
    throw new APIError({
      message: `Too many rows (limit is ${LIMIT_EXPORT})`,
      status: STATUS_406_NOT_ACCEPTABLE,
    })

  // SQL query
  const acts = await knex("acts")
    .leftJoin("askers", "acts.asker_id", "askers.id")
    .join("hospitals", "acts.hospital_id", "hospitals.id")
    .join("users", "acts.added_by", "users.id")
    .where(makeWhereClause(params))
    .orderByRaw(
      "acts.examination_date desc, case when (acts.updated_at is not null) then acts.updated_at else acts.created_at end desc",
    )
    .select([
      "acts.*",
      "askers.name as asker_name",
      "hospitals.name as hospital_name",
      "users.email as user_email",
      "users.first_name as user_first_name",
      "users.last_name as user_last_name",
    ])

  return { elements: transformAllForExport(acts), totalCount: count }
}
