import * as yup from "yup"
import { logError } from "../utils/logger"
import { APIError } from "../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../utils/http"

// from Knex entity to model (JS) entity
export const transform = (knexData) => {
  return !knexData
    ? null
    : {
        id: knexData.id,
        firstName: knexData.first_name,
        lastName: knexData.last_name,
        email: knexData.email,
        role: knexData.role,
        scope: knexData.scope,
        hospital: !knexData.hospital_id
          ? null
          : {
              id: knexData.hospital_id,
              name: knexData.hospital_name || "",
              ...knexData.hospital_extra_data,
            },
      }
}

export const transformAll = (list) => list.map((model) => transform(model))

// from model (JS) entity to Knex entity
export const untransform = (model) => {
  const knexData = {
    first_name: model.firstName,
    last_name: model.lastName,
    email: model.email,
    role: model.role,
    scope: !model.scope?.length ? null : JSON.stringify(model.scope.map((curr) => parseInt(curr.id, 10))), // Array needs to be explicitly stringified in PG
    hospital_id: (model.hospital && model.hospital.id) || null,
  }

  // Pas d'id pour une création de user
  if (model.id) knexData.id = model.id
  if (model.password) knexData.password = model.password

  return knexData
}

const schema = yup.object().shape({
  id: yup.number().positive().integer().nullable(),
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup.string().required(),
  role: yup.string().required(),
  password: yup.string(),
  scope: yup
    .array()
    .default(() => [])
    .nullable(),

  hospital: yup
    .object()
    .shape({
      id: yup.number().positive().integer(),
      name: yup.string(),
    })
    .nullable(),
})

const configValidate = {
  strict: false,
  abortEarly: false,
}

export const validate = async (model) => {
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

export const cast = async (model) => await schema.cast(model)
