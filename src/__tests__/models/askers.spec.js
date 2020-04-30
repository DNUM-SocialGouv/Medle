import { transform, untransform } from "../../models/hospitals"

describe("transform", () => {
  it("should transform in a JS entity", () => {
    const knexData = {
      id: 3,
      name: "Brigade de gendarmerie de Saint-Aignan sur Cher",
      depCode: "41",
      type: "manual",
    }

    expect(transform(knexData)).toMatchSnapshot()
  })
})

describe("untransform", () => {
  it("should untransform in a DB entity", () => {
    const jsData = {
      id: 5,
      name: "Commissariat de police de Vincennes",
      depCode: "94",
      type: "manual",
    }

    expect(untransform(jsData)).toMatchSnapshot()
  })
})
