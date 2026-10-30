import knex from "../knex/knex"

// Shared pagination size used by acts/search.js and acts-summary/search.js
export const LIMIT = 50

// Resolves which hospital ids should be used to filter a query, given an
// optional explicit `hospitals` filter and the current user's `scope`.
export const resolveQueriedHospitals = ({ hospitals, scope }) => {
  if (hospitals?.length) {
    // For valid hospital filter, filter on it
    return hospitals
  } else if (scope?.length) {
    // Otherwise, for scoped user, filter on his scope
    return scope
  }
  // Otherwise, do not filter at all
  return []
}

// Builds a knex where-clause callback filtering `<hospitalIdColumn> in (...)`
// based on the resolved queried hospitals, when any.
export const makeHospitalFilter = (hospitalIdColumn) => (params) => (builder) => {
  const queriedHospitals = resolveQueriedHospitals(params)

  if (queriedHospitals?.length) {
    builder.where(
      knex.raw(`${hospitalIdColumn} in (` + queriedHospitals.map(() => "?").join(",") + ")", [...queriedHospitals]),
    )
  }
}

// Common part of `normalizeParams`: wraps `hospitals` into an array, computes
// the current user `scope`, and restricts `hospitals` to that scope.
export const normalizeHospitalsAndScope = (params, currentUser) => {
  params.hospitals = params.hospitals ? params.hospitals.split(",").map(Number) : []
  params.scope = currentUser?.scope || []
  if (currentUser?.hospital?.id) params.scope = [...params.scope, currentUser.hospital.id]

  // For user having a scope (non super admin, non national user), then restrict potentially their hospital filter
  if (params.hospitals?.length && params.scope?.length) {
    params.hospitals = params.hospitals.filter((hospital) => params.scope.includes(hospital))
  }

  return params
}

// Given a requested page and the total number of elements, returns a valid
// page number (clamped between 1 and maxPage) and the corresponding offset.
export const computeRequestedPage = (requestedPage, totalCount, limit = LIMIT) => {
  const maxPage = Math.ceil(totalCount / limit)

  // set default to 1 if not correct or too little, set default to maxPage if too big
  const page =
    !requestedPage || Number.isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage > maxPage ? maxPage : requestedPage

  return { maxPage, offset: (page - 1) * limit, page }
}
