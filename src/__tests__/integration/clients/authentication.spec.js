import { authenticate } from "../../../clients/authentication"

describe("", () => {
  it("should accept a good authentication", async () => {
    const headersActUserTours = () => authenticate("acte@tours.fr", "test")

    const { user } = await headersActUserTours()
    expect(user).toMatchInlineSnapshot(`
      Object {
        "email": "acte@tours.fr",
        "firstName": "Utilisateur de Tours",
        "hospital": Object {
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
  it("should accept a good authentication with extra spaces in email", async () => {
    const headersActUserTours = () => authenticate("acte@tours.fr     ", "test")

    const { user } = await headersActUserTours()
    expect(user).toMatchInlineSnapshot(`
      Object {
        "email": "acte@tours.fr",
        "firstName": "Utilisateur de Tours",
        "hospital": Object {
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
  it("should not accept not correct email/password", async () => {
    const headersActUserTours = () => authenticate("acte@tours.fr", "test2")

    await expect(headersActUserTours).rejects.toMatchInlineSnapshot(`[APIError: Erreur d'authentification]`)
  })
})
