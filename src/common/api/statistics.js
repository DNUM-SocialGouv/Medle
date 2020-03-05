import moment from "moment"
import { now, ISO_DATE } from "../../utils/date"

const defaultEndDate = () => now().format(ISO_DATE)

const defaultStartDate = date =>
   moment(date)
      .startOf("year")
      .format(ISO_DATE)

export const normalizeDates = ({ startDate, endDate } = {}) => {
   // get now is null or with bad format
   endDate = !endDate ? defaultEndDate() : moment(endDate, ISO_DATE, true).isValid() ? endDate : defaultEndDate()

   // get start date thrown if well formated and before end date, get 1st january of the year of end date if not
   startDate = !startDate
      ? defaultStartDate(endDate)
      : moment(startDate, ISO_DATE, true).isValid() && moment(startDate, ISO_DATE).isBefore(endDate)
      ? startDate
      : defaultStartDate(endDate)

   return { startDate, endDate }
}
