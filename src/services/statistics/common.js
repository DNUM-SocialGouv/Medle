import moment from "moment"
import { now, ISO_DATE } from "../../utils/date"
import { livingProfiles } from "../../utils/actsConstants"
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
  return parseFloat((sum / arr.length).toFixed(2), 10)
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
