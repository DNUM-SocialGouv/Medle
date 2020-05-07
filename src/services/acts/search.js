import knex from "../../knex/knex"
import { transformAll, transformAllForExport } from "../../models/acts"
import { STATUS_406_NOT_ACCEPTABLE } from "../../utils/http"
import { APIError } from "../../utils/errors"
import { ISO_DATE, isValidIsoDate } from "../../utils/date"

const LIMIT = 50
const LIMIT_EXPORT = 10000

export const normalizeInputs = ({
  startDate,
  endDate,
  hospitals,
  profiles,
  asker,
  internalNumber,
  pvNumber,
  fuzzy,
  requestedPage,
  currentUser,
}) => {
  let scope = currentUser?.scope || []
  if (currentUser?.hospital?.id) scope = [...scope, currentUser.hospital.id]

  startDate = isValidIsoDate(startDate) ? startDate : null

  endDate = isValidIsoDate(endDate) ? endDate : null

  hospitals = (hospitals?.split(",") || []).filter((elt) => !isNaN(elt)).map(Number)

  profiles = profiles?.split(",") || []

  asker = isNaN(asker) ? parseInt(asker, 10) : null

  requestedPage = requestedPage && !isNaN(requestedPage) && parseInt(requestedPage, 10)

  return {
    scope,
    startDate,
    endDate,
    hospitals,
    profiles,
    asker,
    internalNumber,
    pvNumber,
    fuzzy,
    requestedPage,
  }
}

export const makeWhereClause = ({ scope, startDate, endDate, internalNumber, pvNumber, fuzzy }) => (builder) => {
  builder.whereNull("acts.deleted_at")
  if (scope?.length) {
    builder.where(knex.raw("acts.hospital_id in (" + scope.map(() => "?").join(",") + ")", [...scope]))
  }

  if (startDate) {
    builder.whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
  }
  if (endDate) {
    builder.whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
  }
  if (internalNumber) {
    builder.where("internal_number", internalNumber)
  }

  if (pvNumber) {
    builder.where("pv_number", pvNumber)
  }

  if (fuzzy) {
    builder.where(function () {
      this.where("internal_number", "ilike", `%${fuzzy}%`)
        .orWhere("pv_number", "ilike", `%${fuzzy}%`)
        .orWhere("profile", "ilike", `%${fuzzy}%`)
    })
  }
}

export const search = async (props, currentUser) => {
  console.log("props", normalizeInputs({ ...props, currentUser }))
  const newInputs = normalizeInputs({ ...props, currentUser })

  const [actsCount] = await knex("acts").where(makeWhereClause(newInputs)).count()

  const totalCount = parseInt(actsCount.count, 10)
  const maxPage = Math.ceil(totalCount / LIMIT)

  let { requestedPage } = newInputs

  // set default to 1 if not correct or too little, set default to maxPage if too big
  requestedPage =
    !requestedPage || isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage > maxPage ? maxPage : requestedPage

  const offset = (requestedPage - 1) * LIMIT

  // SQL query
  const acts = await knex("acts")
    .where(makeWhereClause(newInputs))
    .orderByRaw(
      "acts.examination_date desc, case when (acts.updated_at is not null) then acts.updated_at else acts.created_at end desc"
    )
    .limit(LIMIT)
    .offset(offset)
    .select("*")

  return { totalCount, currentPage: requestedPage, maxPage, byPage: LIMIT, elements: transformAll(acts) }
}

export const searchForExport = async ({ fuzzy, internalNumber, pvNumber }, currentUser) => {
  let scope = currentUser.scope || []
  if (currentUser.hospital && currentUser.hospital.id) scope = [...scope, currentUser.hospital.id]

  const [actsCount] = await knex("acts").where(makeWhereClause({ scope, internalNumber, pvNumber, fuzzy })).count()

  // Limit the export capability to preserv the API
  if (actsCount && actsCount > LIMIT_EXPORT)
    throw new APIError({
      status: STATUS_406_NOT_ACCEPTABLE,
      message: `Too many rows (limit is ${LIMIT_EXPORT})`,
    })

  // SQL query
  const acts = await knex("acts")
    .leftJoin("askers", "acts.asker_id", "askers.id")
    .join("hospitals", "acts.hospital_id", "hospitals.id")
    .join("users", "acts.added_by", "users.id")
    .where(makeWhereClause({ scope, internalNumber, pvNumber, fuzzy }))
    .orderByRaw(
      "acts.examination_date desc, case when (acts.updated_at is not null) then acts.updated_at else acts.created_at end desc"
    )
    .select([
      "acts.*",
      "askers.name as asker_name",
      "hospitals.name as hospital_name",
      "users.email as user_email",
      "users.first_name as user_first_name",
      "users.last_name as user_last_name",
    ])

  return { totalCount: actsCount, elements: transformAllForExport(acts) }
}
