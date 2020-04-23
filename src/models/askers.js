import * as yup from "yup"
import { logError } from "../utils/logger"
import { APIError } from "../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../utils/http"

// from Knex entity to model (JS) entity
export const transform = knexData => {
   return !knexData
      ? null
      : {
           id: knexData.id,
           name: knexData.name,
           depCode: knexData.dep_code,
           type: knexData.type,
        }
}

export const transformAll = list => list.map(model => transform(model))

// from model (JS) entity to Knex entity
export const untransform = model => {
   const knexData = {
      name: model.name,
      dep_code: model.depCode,
      type: model.type,
   }

   // Pas d'id pour une création de user
   if (model.id) knexData.id = model.id

   return knexData
}

const schema = yup.object().shape({
   id: yup
      .number()
      .positive()
      .integer()
      .nullable(),
   name: yup.string(),
   depCode: yup.string().matches(/^$|[0-9]{2,3}/),
   type: yup.string(),
})

const configValidate = {
   strict: false,
   abortEarly: false,
}

export const validate = async model => {
   try {
      const value = await schema.validate(model, configValidate)
      return value
   } catch (error) {
      logError(error)
      throw new APIError({
         status: STATUS_400_BAD_REQUEST,
         message: "Bad request",
         detail: error.inner && error.inner.map(err => [err.path, err.message]),
      })
   }
}

export const cast = async model => await schema.cast(model)
