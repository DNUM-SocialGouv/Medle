import { ASKERS_SEARCH_ENDPOINT, ATTACKS_ENDPOINT, LOGIN_ENDPOINT } from "../../../config"
import { handleAPIResponse } from "../../../utils/errors"
import { METHOD_POST } from "../../../utils/http"
import fetch from "isomorphic-unfetch"

/**
 * Environnement de test :
 * - medle-dev.fabrique.social.gouv.fr
 */

const API_URL = "https://medle-dev.fabrique.social.gouv.fr/api"
const email = "acte@tours.fr"
const password = "test"

let headers

const buildAuthHeaders = async () => {
   const response = await fetch(API_URL + LOGIN_ENDPOINT, {
      method: METHOD_POST,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
   })

   const token = response.headers.get("set-cookie")

   if (!token) {
      throw new Error("Authentication failed")
   }

   headers = {
      headers: {
         cookie: token,
      },
   }
}

describe("endpoints", () => {
   beforeAll(buildAuthHeaders)

   it("should return all attacks for attacks endpoint", async () => {
      const response = await fetch(API_URL + ATTACKS_ENDPOINT, headers)

      const attacks = await handleAPIResponse(response)

      expect(attacks.length).toBeGreaterThanOrEqual(2)
   })

   it("should return more than 100 commissariats in France for askers endpoint", async () => {
      const response = await fetch(`${API_URL + ASKERS_SEARCH_ENDPOINT}?fuzzy=commissariat&all=true`, headers)

      const askers = await handleAPIResponse(response)
      expect(askers.length).toBeGreaterThan(100)
   })
})
