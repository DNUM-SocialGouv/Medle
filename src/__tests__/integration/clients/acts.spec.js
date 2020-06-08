import { authenticate } from "../../../clients/authentication"
import { searchActs } from "../../../clients/acts"

const headersActUserTours = () => authenticate("acte@tours.fr", "test")
const headersActUserNantes = () => authenticate("acte@nantes.fr", "test")

describe("clients for /acts ", () => {
  it("should return 127414-vp act because it belongs to Nantes", async () => {
    const { headers } = await headersActUserNantes()
    const acts = await searchActs({ search: "127414-vp", headers })

    expect(acts.totalCount).toBe(1)
  })
  it("should not return 127414-vp act because it doesn't belong to Tours", async () => {
    const { headers } = await headersActUserTours()
    const acts = await searchActs({ search: "127414-vp", headers })

    expect(acts.totalCount).toBe(0)
  })
  it("should return all acts with Personne décédée", async () => {
    const { headers } = await headersActUserTours()
    const acts = await searchActs({ search: "Personne décédée", headers })

    expect(
      acts.elements.map((act) => ({
        id: act.id,
        pvNumber: act.pvNumber,
        hospital: act.hospital.id,
        profile: act.profile,
      }))
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "hospital": 1,
          "id": 8352,
          "profile": "Personne décédée",
          "pvNumber": "2020/20063",
        },
        Object {
          "hospital": 1,
          "id": 8351,
          "profile": "Personne décédée",
          "pvNumber": "2020/20019",
        },
        Object {
          "hospital": 1,
          "id": 8350,
          "profile": "Personne décédée",
          "pvNumber": "70677/1539/2020",
        },
        Object {
          "hospital": 1,
          "id": 8349,
          "profile": "Personne décédée",
          "pvNumber": "2020/19887",
        },
      ]
    `)
  })
})
