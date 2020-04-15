import { checkValidUserWithPrivilege } from "../../utils/auth"
import { generateToken } from "../../utils/jwt"
import { ACT_MANAGEMENT, EMPLOYMENT_MANAGEMENT } from "../../utils/roles"

const req = {
   cookies: {
      token: generateToken({
         id: "",
         first_name: "firstName",
         last_name: "lastName",
         email: "aze@aze.fr",
         role: "OPERATOR_ACT",
         hospital_id: 1,
         scope: [],
      }),
   },
}

describe("checkValidUserWithPrivilege", () => {
   it("should let pass the user because he has the privilege ACT_MANAGEMENT", async () => {
      expect(checkValidUserWithPrivilege(ACT_MANAGEMENT, req)).toHaveProperty("email", "aze@aze.fr")
   })
   it("should not let pass the user because he has not the privilege EMPLOYMENT_MANAGEMENT", async () => {
      expect(() => checkValidUserWithPrivilege(EMPLOYMENT_MANAGEMENT, req)).toThrowError(
         "Not allowed role (aze@aze.fr)",
      )
   })
})
