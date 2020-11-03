import { transform, untransform } from "../../../models/askers"

describe("transform", () => {
  it("should transform a DB model in JS model", () => {
    const modelDB = {
      id: 5,
      name: "Commissariat de police de Vincennes",
      dep_code: "94",
      type: "manual",
    }

    expect(transform(modelDB)).toMatchInlineSnapshot(`
      Object {
        "depCode": "94",
        "id": 5,
        "name": "Commissariat de police de Vincennes",
        "type": "manual",
      }
    `)
  })
})

describe("untransform", () => {
  it("should untransform a JS model in DB model", () => {
    const modelJS = {
      id: 3,
      name: "Brigade de gendarmerie de Saint-Aignan sur Cher",
      depCode: "41",
      type: "manual",
    }

    expect(untransform(modelJS)).toMatchInlineSnapshot(`
      Object {
        "dep_code": "41",
        "id": 3,
        "name": "Brigade de gendarmerie de Saint-Aignan sur Cher",
        "type": "manual",
      }
    `)
  })
})
