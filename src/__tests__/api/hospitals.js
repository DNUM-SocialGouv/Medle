import { authenticate } from "../../clients/authentication"
import { searchHospitalsFuzzy } from "../../clients/hospitals"

const headersActUserTours = () => authenticate("acte@tours.fr", "test")

describe("/hospitals", () => {
   it("should return CHU de Tours", async () => {
      const { headers } = await headersActUserTours()

      const hostpitals = await searchHospitalsFuzzy({ search: "Tours", headers })

      expect(hostpitals).toMatchSnapshot()
   })
})
