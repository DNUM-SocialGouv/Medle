import { normalizeSearchInputs } from "../../../pages/api/acts/index"

describe("normalizeSearchInputs", () => {
  it("should accept correct values", async () => {
    const props = {
      scope: [],
      startDate: "2020-05-12",
      endDate: "2020-05-08",
      hospitals: [3, 2],
      profiles: ["Personne décédée", "Personne pour âge osseux (hors GAV)"],
      asker: "3850",
      internalNumber: undefined,
      pvNumber: undefined,
      fuzzy: undefined,
      requestedPage: 3,
      currentUser: undefined,
    }

    await expect(normalizeSearchInputs(props)).resolves.toMatchSnapshot()
  }),
    it("should return error for incorrect values", async () => {
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

      await expect(normalizeSearchInputs(props)).rejects.toThrow("Bad request")
    }),
    it("should accept correct values next time", async () => {
      const props = {
        startDate: "2020-01-01",
        endDate: "2020-01-21",
        hospitals: "[1, 2, 3]",
        profiles: '["Victime", "Personne décédée"]',
        asker: "OFPRA",
      }

      await expect(normalizeSearchInputs(props)).resolves.toMatchSnapshot()
    })
})
