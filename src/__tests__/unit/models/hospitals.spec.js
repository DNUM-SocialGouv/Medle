import { transform, untransform } from "../../../models/hospitals"

describe("transform", () => {
  it("should transform in a JS entity", () => {
    const dbHospital = {
      id: 3,
      finesse_number: "1273768",
      name: "CHU de Vincennes",
      addr1: "30 bis rue du Général de Gaulle",
      addr2: "",
      town: "Vincennes",
      dep_code: "94",
      postal_code: "94300",
      extra_data: {
        canDoPostMortem: false,
      },
    }

    expect(transform(dbHospital)).toMatchSnapshot()
  })
})

describe("untransform", () => {
  it("should untransform in a DB entity", () => {
    const jsData = {
      addr1: "30 bis rue du Général de Gaulle",
      addr2: "",
      canDoPostMortem: false,
      depCode: "94",
      finesseNumber: "1273768",
      id: 3,
      name: "CHU de Vincennes",
      postalCode: "94300",
      town: "Vincennes",
    }

    expect(untransform(jsData)).toMatchSnapshot()
  })
  it("should untransform in a DB entity even with null id", () => {
    const jsData = {
      addr1: "30 bis rue du Général de Gaulle",
      addr2: "",
      canDoPostMortem: false,
      depCode: "94",
      finesseNumber: "1273768",
      name: "CHU de Vincennes",
      postalCode: "94300",
      town: "Vincennes",
    }

    expect(untransform(jsData)).toMatchSnapshot()
  })
  it("should untransform in a DB entity even with empty string id", () => {
    const jsData = {
      id: "",
      addr1: "30 bis rue du Général de Gaulle",
      addr2: "",
      canDoPostMortem: false,
      depCode: "94",
      finesseNumber: "1273768",
      name: "CHU de Vincennes",
      postalCode: "94300",
      town: "Vincennes",
    }

    expect(untransform(jsData)).toMatchSnapshot()
  })
})
