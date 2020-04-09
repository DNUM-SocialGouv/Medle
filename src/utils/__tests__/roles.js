import { availableRolesForUser, rulesOfRoles, isAllowed } from "../roles"

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

describe("rulesOfRoles", () => {
   it("checks the roles for ADMIN_HOSPITAL", () => {
      const rules = rulesOfRoles("ADMIN_HOSPITAL")

      expect(rules.hospitalDisabled).toBe(false)
      expect(rules.hospitalRequired).toBe(true)
      expect(rules.scopeDisabled).toBe(true)
      expect(rules.scopeRequired).toBe(false)
   })
   it("checks the roles for OPERATOR_ACT", () => {
      const rules = rulesOfRoles("OPERATOR_ACT")

      expect(rules.hospitalDisabled).toBe(false)
      expect(rules.hospitalRequired).toBe(true)
      expect(rules.scopeDisabled).toBe(true)
      expect(rules.scopeRequired).toBe(false)
   })
   it("checks the roles for REGIONAL_SUPERVISOR", () => {
      const rules = rulesOfRoles("REGIONAL_SUPERVISOR")

      expect(rules.hospitalDisabled).toBe(true)
      expect(rules.hospitalRequired).toBe(false)
      expect(rules.scopeDisabled).toBe(false)
      expect(rules.scopeRequired).toBe(true)
   })
})

describe("availableRolesForUser", () => {
   it("checks the roles for SUPER_ADMIN", () => {
      const superAdmin = { role: "SUPER_ADMIN" }
      const roles = availableRolesForUser(superAdmin)

      expect(roles.includes("ADMIN_HOSPITAL")).toBe(true)
      expect(roles.includes("OPERATOR_ACT")).toBe(true)
      expect(roles.includes("REGIONAL_SUPERVISOR")).toBe(true)
      expect(roles.includes("SUPER_ADMIN")).toBe(true)
   })
   it("checks the roles for ADMIN_HOSPITAL", () => {
      const admin = { role: "ADMIN_HOSPITAL" }
      const roles = availableRolesForUser(admin)

      expect(roles.includes("ADMIN_HOSPITAL")).toBe(false)
      expect(roles.includes("OPERATOR_ACT")).toBe(true)
      expect(roles.includes("OPERATOR_EMPLOYMENT")).toBe(true)
      expect(roles.includes("REGIONAL_SUPERVISOR")).toBe(false)
      expect(roles.includes("REGIONAL_SUPERVISOR")).toBe(false)
      expect(roles.includes("SUPER_ADMIN")).toBe(false)
   })
})
