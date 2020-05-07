import { normalizeInputs } from "../../services/acts/search"

describe("", () => {
  it("should normalizeInputs", () => {
    const props = {
      scope: [],
      startDate: "2020-05-12",
      endDate: "2020-05-08",
      hospitals: "3,2",
      profiles: "Personne décédée,Personne pour âge osseux (hors GAV)",
      asker: "3849",
      internalNumber: undefined,
      pvNumber: undefined,
      fuzzy: undefined,
      requestedPage: 3,
      currentUser: undefined,
    }

    expect(normalizeInputs(props)).toMatchSnapshot()
  }),
    it("should normalizeInputs with incorrect values", () => {
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

      expect(normalizeInputs(props)).toMatchSnapshot()
    })
})
