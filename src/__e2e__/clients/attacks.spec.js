import { authenticate } from "../../clients/authentication"
import { findAllAttacks } from "../../clients/attacks"

const headersActUserTours = () => authenticate("acte@tours.fr", "test")

describe("/attacks", () => {
  it("should return all attacks", async () => {
    const { headers } = await headersActUserTours()
    const attacks = await findAllAttacks({ headers })

    expect(attacks).toMatchSnapshot()
  })
})
