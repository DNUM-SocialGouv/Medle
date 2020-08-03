import { authenticate } from "../../clients/authentication"
import { createAct, searchActsByKey } from "../../clients/acts"

const headersActUserTours = () => authenticate("acte@tours.fr", "test")

describe("/acts", () => {
  it("should be possible to an act operator of Tours to add an act", async () => {
    const { headers } = await headersActUserTours()

    await createAct({
      act: {
        addedBy: 2,
        askerId: 8,
        examinationDate: "2020-04-14",
        examinations: ["Autres"],
        examinationTypes: ["Somatique", "Psychiatrique"],
        hospitalId: 1,
        internalNumber: "wxwxwx123123",
        location: "UMJ",
        periodOfDay: "Nuit profonde",
        personAgeTag: "0-2 ans",
        personGender: "Féminin",
        profile: "Victime (vivante)",
        pvNumber: "",
        violenceContexts: ["Autre type/Autre", "Infra-familiale (hors conjugale)"],
        violenceNatures: ["Sexuelle", "Attentat/Hyper Cacher"],
      },
      headers,
    })

    const acts = await searchActsByKey({ key: "internalNumber", value: "wxwxwx123123", headers })

    expect(acts[0]).toMatchSnapshot({
      id: expect.any(Number),
    })
  })
})
