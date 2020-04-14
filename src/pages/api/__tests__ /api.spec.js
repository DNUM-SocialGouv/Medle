import { ASKERS_ENDPOINT, ATTACKS_ENDPOINT, ACTS_ENDPOINT } from "../../../config"
import { handleAPIResponse } from "../../../utils/errors"
import { authenticate } from "../../../clients/authentication"
import { METHOD_POST } from "../../../utils/http"

const API_URL = process.env.API_URL

const headersActUserTours = () => authenticate("acte@tours.fr", "test")
//const headersActUserNantes = () => authenticate("acte@nantes.fr", "test")

describe("/attacks", () => {
   it("should return all attacks for attacks endpoint", async () => {
      const response = await fetch(API_URL + ATTACKS_ENDPOINT, await headersActUserTours())

      const attacks = await handleAPIResponse(response)

      expect(attacks).toMatchSnapshot()
   })

   it("should return all commissariats in France for askers endpoint", async () => {
      const response = await fetch(
         `${API_URL + ASKERS_ENDPOINT}?fuzzy=commissariat&all=true`,
         await headersActUserTours(),
      )

      const askers = await handleAPIResponse(response)
      expect(askers).toMatchSnapshot()
   })
})

describe("/acts", () => {
   it("should be possible to an act operator of Tours to add an act", async () => {
      const { headers: headersTours } = await headersActUserTours()

      await fetch(API_URL + ACTS_ENDPOINT, {
         method: METHOD_POST,
         headers: headersTours,
         body: JSON.stringify({
            addedBy: 2,
            askerId: 8,
            examinationDate: "2020-04-14",
            examinations: ["Autres"],
            examinationTypes: ["Somatique", "Psychiatrique"],
            hospitalId: 1,
            internalNumber: "azeaze",
            location: "UMJ",
            periodOfDay: "Nuit profonde",
            personAgeTag: "0-2 ans",
            personGender: "Féminin",
            profile: "Victime (vivante)",
            pvNumber: "",
            violenceContexts: ["Autre type/Autre", "Infra-familiale (hors conjugale)"],
            violenceNatures: ["Sexuelle", "Attentat/Hyper Cacher"],
         }),
      })

      const response = await fetch(API_URL + ACTS_ENDPOINT, { headers: headersTours })

      const acts = await handleAPIResponse(response)

      expect(acts.elements[0]).toMatchSnapshot({
         id: expect.any(Number),
      })
   })
})
