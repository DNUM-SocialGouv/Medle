import { normalizeDates } from "../../services/statistics/common"
import { now, ISO_DATE } from "../../utils/date"

describe("tests on normalizeDates", () => {
   it("1) should return the dates when it's well formated and start before end", () => {
      expect(normalizeDates({ startDate: "2010-12-30", endDate: "2011-12-10" })).toEqual({
         startDate: "2010-12-30",
         endDate: "2011-12-10",
      })
   })

   it("2) should return the current day when there is no input", () => {
      expect(normalizeDates()).toEqual({
         startDate: now().format(ISO_DATE),
         endDate: now().format(ISO_DATE),
      })
   })

   it("3) should return the end date for start date if it is after end date", () => {
      expect(normalizeDates({ startDate: "2020-03-20", endDate: "2020-03-10" })).toEqual({
         startDate: "2020-03-10",
         endDate: "2020-03-10",
      })
   })

   it("4) should return the end date for start date if it is not well formated", () => {
      expect(normalizeDates({ startDate: "2010/10/10", endDate: "2020-03-10" })).toEqual({
         startDate: "2020-03-10",
         endDate: "2020-03-10",
      })
   })
})
