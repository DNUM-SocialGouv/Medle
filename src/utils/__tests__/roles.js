import { isAllowed } from "../roles"

describe("isAllowed", () => {
   it("an OPERATOR_ACT should have ACT_MANAGEMENT capability", async () => {
      expect(isAllowed("OPERATOR_ACT", "ACT_CONSULTATION")).toBeTruthy()
   })
   it("an OPERATOR_ACT should not have ADMIN capability", async () => {
      expect(isAllowed("OPERATOR_ACT", "ADMIN")).toBeFalsy()
   })
   it("an OPERATOR_EMPLOYMENT should not have ACT_MANAGEMENT capability", async () => {
      expect(isAllowed("OPERATOR_EMPLOYMENT", "ACT_MANAGEMENT")).toBeFalsy()
   })
   it("a GUEST_HOSPITAL should not have EMPLOYMENT_MANAGEMENT capability", async () => {
      expect(isAllowed("GUEST_HOSPITAL", "EMPLOYMENT_MANAGEMENT")).toBeFalsy()
   })
   it("anybody should have NO_PRIVILEGE_REQUIRED capability", async () => {
      expect(isAllowed("ANY ROLE", "NO_PRIVILEGE_REQUIRED")).toBeTruthy()
   })
   it("a REGIONAL_SUPERVISOR should have EMPLOYMENT_CONSULTATION capability", async () => {
      expect(isAllowed("REGIONAL_SUPERVISOR", "EMPLOYMENT_CONSULTATION")).toBeTruthy()
   })
   it("a REGIONAL_SUPERVISOR should not have ACT_MANAGEMENT capability", async () => {
      expect(isAllowed("REGIONAL_SUPERVISOR", "ACT_MANAGEMENT")).toBeFalsy()
   })
   it("a REGIONAL_SUPERVISOR should not have EMPLOYMENT_MANAGEMENT capability", async () => {
      expect(isAllowed("REGIONAL_SUPERVISOR", "EMPLOYMENT_MANAGEMENT")).toBeFalsy()
   })
})
