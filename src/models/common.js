import { logError } from "../utils/logger"
import { APIError } from "../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../utils/http"
import { revertObject } from "../utils/misc"

const configValidate = {
  strict: false,
  abortEarly: false,
}

const validate = (schema) => async (model) => {
  try {
    const value = await schema.validate(model, configValidate)
    return value
  } catch (error) {
    logError(error)
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
      detail: error.inner && error.inner.map((err) => [err.path, err.message]),
    })
  }
}

// TODO supprimer si pas utilisé ?
const cast = (schema) => async (model) => await schema.cast(model)

// Transform a DB model into JS model
const transform = (JStoDBKeys) => (modelDB) => {
  if (!modelDB) return null

  const DBtoJSKeys = revertObject(JStoDBKeys)

  // add extra_data first so regular fields can't be overriden by bad luck
  const modelJS = { ...modelDB.extra_data }

  for (const [keyDB, value] of Object.entries(modelDB)) {
    if (keyDB !== "extra_data") {
      const key = DBtoJSKeys[keyDB]
      if (key) modelJS[key] = value
    }
  }

  return modelJS
}

const transformAll = (transform) => (list) => list.map((model) => transform(model))

// Transform a JS model into DB model
const untransform = (JStoDBKeys) => (modelJS) => {
  if (!modelJS) return null

  const extra_data = {}
  const modelDB = {}

  for (const [key, value] of Object.entries(modelJS)) {
    const keyDB = JStoDBKeys[key]

    if (keyDB) {
      modelDB[keyDB] = value
    } else {
      extra_data[key] = value
    }
  }

  if (Object.keys(extra_data).length) modelDB.extra_data = extra_data

  // Pas d'id pour une création
  if (!modelJS.id) delete modelDB.id

  return modelDB
}

const untransformAll = (untransform) => (list) => list.map((model) => untransform(model))

export const build = ({ JStoDBKeys, schema }) => {
  const innerTransform = transform(JStoDBKeys)
  const innerUntransform = untransform(JStoDBKeys)

  return {
    // Transform a DB model into JS model
    transform: innerTransform,
    transformAll: transformAll(innerTransform),
    // Transform a JS model into DB model
    untransform: innerUntransform,
    untransformAll: untransformAll(innerUntransform),
    validate: validate(schema),
    cast: cast(schema),
  }
}
