import moment from "moment"
import { now, ISO_DATE } from "../../utils/date"

const defaultEndDate = () => now().format(ISO_DATE)

// end date must be not null, well formatted and not in the future
export const isValidEndDate = endDate =>
  endDate && moment(endDate, ISO_DATE, true).isValid() && moment(endDate, ISO_DATE).isSameOrBefore(now())

export const isValidStartDate = (startDate, endDate) =>
  startDate && moment(startDate, ISO_DATE, true).isValid() && moment(startDate, ISO_DATE).isSameOrBefore(endDate)

export const normalizeDates = ({ startDate, endDate } = {}) => {
  // get now if end date is null or not well formatted
  endDate = isValidEndDate(endDate) ? endDate : defaultEndDate()

  // get start date thrown if well formated and before end date, get 1st january of the year of end date if not
  startDate = isValidStartDate(startDate, endDate) ? startDate : endDate

  return { startDate, endDate }
}

export const normalizeInputs = ({ startDate, endDate, scopeFilter = [] }, reachableScope) => {
  // verification if all the scope filter is included in the reachable scope
  for (let i = 0; i < scopeFilter.length; i++) {
    if (!reachableScope.includes(scopeFilter[i])) {
      scopeFilter = []
      break
    }
  }

  return {
    ...normalizeDates({ startDate, endDate }),
    scopeFilter,
  }
}

export const averageOf = arr => {
  if (!arr || !arr.length) return 0
  const sum = arr.reduce((acc, curr) => acc + curr)
  return parseFloat((sum / arr.length).toFixed(2), 10)
}
