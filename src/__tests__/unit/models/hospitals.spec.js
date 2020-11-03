import { transform, transformAll, untransform, validate } from "../../../models/hospitals"

describe("transform tests", () => {
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

    expect(transform(dbHospital)).toMatchInlineSnapshot(`
      Object {
        "addr1": "30 bis rue du Général de Gaulle",
        "addr2": "",
        "canDoPostMortem": false,
        "depCode": "94",
        "finesseNumber": "1273768",
        "id": 3,
        "name": "CHU de Vincennes",
        "postalCode": "94300",
        "town": "Vincennes",
      }
    `)
  })

  test("transform should return nothing if null is passed", () => {
    expect(transform(null)).toMatchInlineSnapshot(`null`)
    expect(transform({})).toMatchInlineSnapshot(`Object {}`)
  })
})

describe("untransform tests", () => {
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

    expect(untransform(jsData)).toMatchInlineSnapshot(`
      Object {
        "addr1": "30 bis rue du Général de Gaulle",
        "addr2": "",
        "dep_code": "94",
        "extra_data": Object {
          "canDoPostMortem": false,
        },
        "finesse_number": "1273768",
        "id": 3,
        "name": "CHU de Vincennes",
        "postal_code": "94300",
        "town": "Vincennes",
      }
    `)
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

    expect(untransform(jsData)).toMatchInlineSnapshot(`
      Object {
        "addr1": "30 bis rue du Général de Gaulle",
        "addr2": "",
        "dep_code": "94",
        "extra_data": Object {
          "canDoPostMortem": false,
        },
        "finesse_number": "1273768",
        "name": "CHU de Vincennes",
        "postal_code": "94300",
        "town": "Vincennes",
      }
    `)
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

    expect(untransform(jsData)).toMatchInlineSnapshot(`
      Object {
        "addr1": "30 bis rue du Général de Gaulle",
        "addr2": "",
        "dep_code": "94",
        "extra_data": Object {
          "canDoPostMortem": false,
        },
        "finesse_number": "1273768",
        "name": "CHU de Vincennes",
        "postal_code": "94300",
        "town": "Vincennes",
      }
    `)
  })

  test("untransform should return nothing if null is passed", () => {
    expect(untransform(null)).toMatchInlineSnapshot(`null`)
    expect(untransform({})).toMatchInlineSnapshot(`Object {}`)
  })

  test("untransform", () => {
    const jsData = {
      canDoPostMortem: true,
      id: 32,
      finesseNumber: "060785003",
      name: "Nice",
      addr1: "30 Voie Romaine",
      addr2: "",
      town: "Nice",
      depCode: "06",
      postalCode: "06000",
    }

    expect(untransform(jsData)).toMatchInlineSnapshot(`
      Object {
        "addr1": "30 Voie Romaine",
        "addr2": "",
        "dep_code": "06",
        "extra_data": Object {
          "canDoPostMortem": true,
        },
        "finesse_number": "060785003",
        "id": 32,
        "name": "Nice",
        "postal_code": "06000",
        "town": "Nice",
      }
    `)
  })
})

test("transformAll", () => {
  const entities = [
    {
      addr1: "30 Voie Romaine",
      addr2: "",
      dep_code: "06",
      extra_data: {
        canDoPostMortem: true,
      },
      finesse_number: "060785003",
      id: 32,
      name: "Nice",
      postal_code: "06000",
      town: "Nice",
    },
    {
      addr1: "28 rue de la Fraternité",
      addr2: "",
      dep_code: "94",
      extra_data: {
        canDoPostMortem: false,
        etp: {
          doctors: 1.3,
          ides: 2,
        },
      },
      finesse_number: "060785004",
      id: 33,
      name: "Vincennes",
      postal_code: "94300",
      town: "Vincennes",
    },
  ]

  expect(transformAll(entities)).toMatchInlineSnapshot(`
    Array [
      Object {
        "addr1": "30 Voie Romaine",
        "addr2": "",
        "canDoPostMortem": true,
        "depCode": "06",
        "finesseNumber": "060785003",
        "id": 32,
        "name": "Nice",
        "postalCode": "06000",
        "town": "Nice",
      },
      Object {
        "addr1": "28 rue de la Fraternité",
        "addr2": "",
        "canDoPostMortem": false,
        "depCode": "94",
        "etp": Object {
          "doctors": 1.3,
          "ides": 2,
        },
        "finesseNumber": "060785004",
        "id": 33,
        "name": "Vincennes",
        "postalCode": "94300",
        "town": "Vincennes",
      },
    ]
  `)
})

describe("validate tests", () => {
  test("validate ok", async () => {
    const model = {
      addr1: "30 Voie Romaine",
      addr2: "",
      dep_code: "06",
      extra_data: {
        canDoPostMortem: true,
      },
      finesse_number: "060785003",
      id: 32,
      name: "Nice",
      postal_code: "06000",
      town: "Nice",
    }
    await expect(validate(model)).resolves.toMatchInlineSnapshot(`
            Object {
              "addr1": "30 Voie Romaine",
              "addr2": "",
              "dep_code": "06",
              "extra_data": Object {
                "canDoPostMortem": true,
              },
              "finesse_number": "060785003",
              "id": 32,
              "name": "Nice",
              "postal_code": "06000",
              "town": "Nice",
            }
          `)
  })

  test("validate ko", async () => {
    const originalError = console.error
    console.error = jest.fn()

    const model = {
      addr1: "30 Voie Romaine",
      addr2: "",
      dep_code: "06",
      extra_data: {
        canDoPostMortem: true,
      },
      finesse_number: "060785003",
      id: "jo",
      name: "Nice",
      postal_code: "aozieuaz",
      town: "Nice",
    }

    await expect(validate(model)).rejects.toMatchInlineSnapshot(`[APIError: Bad request]`)

    console.error = originalError
  })
})
