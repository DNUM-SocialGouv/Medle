import { authenticate } from "../../clients/authentication"
import { searchAskersFuzzy } from "../../clients/askers"

const headersActUserTours = () => authenticate("acte@tours.fr", "test")

describe("/askers", () => {
  it("should return all criminal courts in France", async () => {
    const { headers } = await headersActUserTours()

    const askers = await searchAskersFuzzy({ search: "Saint-Aignan", headers })

    expect(askers).toMatchSnapshot()
  })
})
