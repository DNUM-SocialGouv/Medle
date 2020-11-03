import Router from "next/router"

import { authenticate } from "../../clients/authentication"
import { logError } from "../../utils/logger"

// Router needs to be mocked because we are nor in browser environement, nor in Next/SSR environment
jest.mock("next/router")
jest.mock("../../utils/logger")

describe("check authentication API", () => {
  test("it should accept a good authentication", async () => {
    const headersActUserTours = () => authenticate("acte@tours.fr", "test")

    const { user } = await headersActUserTours()
    expect(user).toMatchInlineSnapshot(`
      Object {
        "email": "acte@tours.fr",
        "firstName": "Utilisateur de Tours",
        "hospital": Object {
          "canDoPostMortem": true,
          "id": 1,
          "name": "CHRU de Tours",
        },
        "id": 2,
        "lastName": "Actes",
        "role": "OPERATOR_ACT",
        "scope": null,
      }
    `)
  })
  test("it should accept a good authentication with extra spaces in email", async () => {
    const headersActUserTours = () => authenticate("acte@tours.fr     ", "test")

    const { user } = await headersActUserTours()
    expect(user).toMatchInlineSnapshot(`
      Object {
        "email": "acte@tours.fr",
        "firstName": "Utilisateur de Tours",
        "hospital": Object {
          "canDoPostMortem": true,
          "id": 1,
          "name": "CHRU de Tours",
        },
        "id": 2,
        "lastName": "Actes",
        "role": "OPERATOR_ACT",
        "scope": null,
      }
    `)
  })

  test("it should not accept incorrect email/password", async () => {
    const headersActUserTours = () => authenticate("acte@tours.fr", "test2")

    await expect(headersActUserTours).rejects.toMatchInlineSnapshot(`[Error: Authentication failed]`)

    expect(Router.push).toHaveBeenCalledTimes(1)
    expect(Router.push).toHaveBeenCalledWith("/?sessionTimeout=1")

    expect(logError).toHaveBeenCalledTimes(1)
  })
})
