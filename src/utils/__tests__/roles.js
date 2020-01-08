import { isAllowed } from "../roles"

describe("isAllowed", () => {
   it("an OPERATOR_ACT should have ACT_MANAGEMENT capability", async () => {
      expect(isAllowed("OPERATOR_ACT", "ACT_CONSULTATION")).toBeTruthy()
   })
   it("an GUEST_HOSPITAL should not have EMPLOYMENT_MANAGEMENT capability", async () => {
      expect(isAllowed("GUEST_HOSPITAL", "EMPLOYMENT_MANAGEMENT")).toBeFalsy()
   })
})
