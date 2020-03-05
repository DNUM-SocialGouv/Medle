import { normalizeDates } from "../statistics"
import { now, ISO_DATE } from "../../../utils/date"
import moment from "moment"

describe("tests on normalizeDates", () => {
   it("should return the dates when it's well formated and start before end", () => {
      expect(normalizeDates({ startDate: "2010-12-30", endDate: "2011-12-10" })).toEqual({
         startDate: "2010-12-30",
         endDate: "2011-12-10",
      })
   })

   it("should return the current day when there is no input", () => {
      expect(normalizeDates()).toEqual({
         startDate: now()
            .startOf("year")
            .format(ISO_DATE),
         endDate: now().format(ISO_DATE),
      })
   })

   it("should return the 1st january for start date if it is after end date", () => {
      expect(normalizeDates({ startDate: "2020-03-20", endDate: "2020-03-10" })).toEqual({
         startDate: moment("2020-03-10")
            .startOf("year")
            .format(ISO_DATE),
         endDate: "2020-03-10",
      })
   })
   it("should return the 1st january for start date if it is not well formated", () => {
      expect(normalizeDates({ startDate: "2010/10/10", endDate: "2020-10-10" })).toEqual({
         startDate: moment("2020-10-10")
            .startOf("year")
            .format(ISO_DATE),
         endDate: "2020-10-10",
      })
   })
})
