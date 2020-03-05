import moment from "moment"
import { now, ISO_DATE } from "../../utils/date"

const defaultEndDate = now()

const defaultStartDate = date => moment(date).startOf("year")

export const normalizeEndDate = date =>
   !date ? defaultEndDate : moment(date, ISO_DATE).isValid() ? date : defaultEndDate

export const normalizeStartDate = (startDate, endDate) =>
   !startDate
      ? defaultStartDate(endDate)
      : moment(startDate, ISO_DATE).isValid() && startDate.isBefore(endDate)
      ? startDate
      : defaultStartDate(endDate)
