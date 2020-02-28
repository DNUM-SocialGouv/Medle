import { getSituationDate } from "../actsConstants"

describe("getSituationDate", () => {
   it("01/01/2001 is public holiday so is considered sunday", async () => {
      expect(getSituationDate("2001-01-01")).toBe("sunday")
   })
   it("16/05/2018 is a week day", async () => {
      expect(getSituationDate("2018-05-16")).toBe("week")
   })
   it("13/04/2020 is 'Lundi de Pâques', a public holiday, so is considered sunday", async () => {
      expect(getSituationDate("2020-04-13")).toBe("sunday")
   })
   it("16/02/2019 is saturday", async () => {
      expect(getSituationDate("2019-02-16")).toBe("saturday")
   })
   it("14/07/1976 is public holiday so is considered sunday", async () => {
      expect(getSituationDate("1976-07-14")).toBe("sunday")
   })
})
