import { normalizeParams } from "../../../services/acts/search"

describe("normalizeParams", () => {
  it("should accept correct values", async () => {
    const currentUser = {}
    const props = {
      scope: [],
      startDate: "2020-05-12",
      endDate: "2020-05-08",
      hospitals: "3, 2",
      profiles: "Personne décédée,Personne pour âge osseux (hors GAV)",
      asker: "3850",
      internalNumber: undefined,
      pvNumber: undefined,
      fuzzy: undefined,
      requestedPage: 3,
      currentUser: undefined,
    }

    // try {
    //   await normalizeParams(props, currentUser)
    // } catch (err) {
    //   console.log("err", err)
    // }

    await expect(normalizeParams(props, currentUser)).resolves.toMatchInlineSnapshot(`
            Object {
              "asker": 3850,
              "endDate": 2020-05-07T22:00:00.000Z,
              "hospitals": Array [
                3,
                2,
              ],
              "profiles": Array [
                "Personne décédée",
                "Personne pour âge osseux (hors GAV)",
              ],
              "requestedPage": 3,
              "scope": Array [],
              "startDate": 2020-05-11T22:00:00.000Z,
            }
          `)
  }),
    it("should return error for incorrect values", async () => {
      const currentUser = {}

      const props = {
        scope: [],
        startDate: "15-12",
        endDate: "2020-05-08",
        hospitals: "3,aze, 2",
        profiles: "Personne décédée,Personne pour âge osseux (hors GAV)",
        asker: "3849",
        internalNumber: "123456",
        pvNumber: undefined,
        fuzzy: "Vict",
        requestedPage: -1,
        currentUser: { scope: [1, 3] },
      }

      await expect(normalizeParams(props, currentUser)).rejects.toMatchInlineSnapshot(`[APIError: Bad request]`)
    }),
    it("should accept another correct values", async () => {
      const currentUser = {}

      const props = {
        startDate: "2020-01-01",
        endDate: "2020-01-21",
        hospitals: "1, 2, 3",
        profiles: "Victime, Personne décédée",
        asker: "3850",
      }

      await expect(normalizeParams(props, currentUser)).resolves.toMatchInlineSnapshot(`
              Object {
                "asker": 3850,
                "endDate": 2020-01-20T23:00:00.000Z,
                "hospitals": Array [
                  1,
                  2,
                  3,
                ],
                "profiles": Array [
                  "Victime",
                  " Personne décédée",
                ],
                "scope": Array [],
                "startDate": 2019-12-31T23:00:00.000Z,
              }
            `)
    })
  it("should accept with a user having a user scope", async () => {
    const currentUser = { scope: [3, 6] }

    const props = {
      hospitals: "1, 2, 3",
      asker: "200",
    }

    await expect(normalizeParams(props, currentUser)).resolves.toMatchInlineSnapshot(`
            Object {
              "asker": 200,
              "hospitals": Array [
                3,
              ],
              "profiles": Array [],
              "scope": Array [
                3,
                6,
              ],
            }
          `)
  }),
    it("should accept with a user having a hospital id", async () => {
      const currentUser = { hospital: { id: 1, name: "CHU de Tours" } }

      const props = {
        hospitals: "2, 3",
        asker: "201",
      }

      await expect(normalizeParams(props, currentUser)).resolves.toMatchInlineSnapshot(`
              Object {
                "asker": 201,
                "hospitals": Array [],
                "profiles": Array [],
                "scope": Array [
                  1,
                ],
              }
            `)
    })
})
