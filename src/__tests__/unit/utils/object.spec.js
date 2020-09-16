import { objToArray } from "../../../utils/object"

test("objToArray without labels should use object's properties", () => {
  const obj = {
    "Avec réquisition": 13,
    "Recueil de preuve sans plainte": 2,
    "Sans réquisition": 143,
  }
  expect(objToArray(obj)).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "Avec réquisition",
        "value": 13,
      },
      Object {
        "name": "Recueil de preuve sans plainte",
        "value": 2,
      },
      Object {
        "name": "Sans réquisition",
        "value": 143,
      },
    ]
  `)
})

test("objToArray with labels should use labels array", () => {
  const obj = {
    "Avec réquisition": 13,
    "Recueil de preuve sans plainte": 2,
    "Sans réquisition": 143,
  }
  expect(objToArray(obj, ["Avec réquisition", "Sans réquisition"])).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "Avec réquisition",
        "value": 13,
      },
      Object {
        "name": "Sans réquisition",
        "value": 143,
      },
    ]
  `)
})

test("objToArray with invalid labels should use object's properties", () => {
  const obj = {
    "Avec réquisition": 13,
    "Recueil de preuve sans plainte": 2,
    "Sans réquisition": 143,
  }
  expect(
    objToArray(obj, [
      { "Avec réquisition": "Avec n° de réquisition" },
      { "Sans réquisition": "Sans n° de réquisition" },
    ])
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "Avec n° de réquisition",
        "value": 13,
      },
      Object {
        "name": "Sans n° de réquisition",
        "value": 143,
      },
    ]
  `)
})

test("objToArray with labels: bad content (object version) must be ignored", () => {
  const obj = {
    "Avec réquisition": 13,
    "Recueil de preuve sans plainte": 2,
    "Sans réquisition": 143,
  }
  expect(
    objToArray(obj, [
      { "Avec réquisition": "Avec n° de réquisition" },
      { "autre clé qui n'existe pas": "autre clé qui n'existe pas" },
    ])
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "Avec n° de réquisition",
        "value": 13,
      },
    ]
  `)
})

test("objToArray with labels:  bad content (string version) must be ignored", () => {
  const obj = {
    "Avec réquisition": 13,
    "Recueil de preuve sans plainte": 2,
    "Sans réquisition": 143,
  }
  expect(objToArray(obj, [{ "Avec réquisition": "Avec n° de réquisition" }, "autre clé qui n'existe pas"]))
    .toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "Avec n° de réquisition",
        "value": 13,
      },
    ]
  `)
})
