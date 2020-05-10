import { authenticate } from "../../../clients/authentication"
import { searchActsFuzzy } from "../../../clients/acts"

const headersActUserTours = () => authenticate("acte@tours.fr", "test")
//const headersActUserNantes = () => authenticate("acte@nantes.fr", "test")

describe("clients for /acts ", () => {
  it("should return all acts with a particular internal number", async () => {
    const { headers } = await headersActUserTours()
    const acts = await searchActsFuzzy({ search: "127414-vp", headers })

    expect(acts).toMatchSnapshot()
  })
  it("should return all acts with Personne décédée", async () => {
    const { headers } = await headersActUserTours()
    const acts = await searchActsFuzzy({ search: "Personne décédée", headers })

    expect(acts).toMatchSnapshot()
  })
})
