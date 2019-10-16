import { validate } from "../[id]"

describe("validate should validate only positive numeric value", () => {
   it("should be converted in number", () => {
      expect(validate("4569087")).toEqual(4569087)
      expect(validate("1111")).toEqual(1111)
   })

   it("should return false", () => {
      expect(validate("567GHJ")).toEqual(false)
      expect(validate("U789")).toEqual(false)
      expect(validate("12 34")).toEqual(false)
   })
})
