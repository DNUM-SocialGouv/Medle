import { buildScope } from "../scope"

describe("tests on buildScope", () => {
   it("should return the union between the scope array and the hospital id", () => {
      const currentUser = {
         scope: [1, 2],
         hospital: {
            id: 3,
         },
      }

      expect(buildScope(currentUser)).toEqual([1, 2, 3])
   })
   it("should return only the scope when there is no hospital id", () => {
      const currentUser = {
         scope: [1, 2],
      }

      expect(buildScope(currentUser)).toEqual([1, 2])
   })
   it("should return empty array in case of a user with nothing (not expected)", () => {
      const currentUser = {}

      expect(buildScope(currentUser)).toEqual([])
   })
   it("should return hostpital id when user has no scope array", () => {
      const currentUser = {
         hospital: {
            id: 3,
         },
      }

      expect(buildScope(currentUser)).toEqual([3])
   })
})
