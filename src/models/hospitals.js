import * as yup from "yup"
import { logError } from "../utils/logger"
import { APIError } from "../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../utils/http"

// from Knex entity to model (JS) entity
export const transform = knexData => {
   return !knexData
      ? null
      : {
           ...knexData.extra_data, // add it first so regular fields can't be overriden by bad luck
           id: knexData.id,
           finesseNumber: knexData.finesse_number,
           name: knexData.name,
           addr1: knexData.addr1,
           addr2: knexData.addr2,
           town: knexData.town,
           depCode: knexData.dep_code,
           postalCode: knexData.postal_code,
        }
}

export const transformAll = list => list.map(model => transform(model))

// from model (JS) entity to Knex entity
export const untransform = model => {
   const knexData = { extra_data: {} }

   const predefinedKeys = {
      id: "id",
      finesseNumber: "finesse_number",
      name: "name",
      category: "category",
      addr1: "addr1",
      addr2: "addr2",
      town: "town",
      depCode: "dep_code",
      postalCode: "postal_code",
   }

   Object.keys(model).forEach(key => {
      if (predefinedKeys[key]) {
         knexData[predefinedKeys[key]] = model[key]
      } else {
         knexData.extra_data[key] = model[key]
      }
   })

   // Pas d'id pour une création de user
   if (!model.id) delete knexData.id
   return knexData
}

const schema = yup.object().shape({
   id: yup
      .number()
      .positive()
      .integer()
      .nullable(),
   finesseNumber: yup.string(),
   name: yup.string(),
   category: yup.string(),
   addr1: yup.string(),
   addr2: yup.string(),
   town: yup.string(),
   depCode: yup.string().matches(/[0-9]{2,3}/),
   postalCode: yup.string().matches(/^$|[0-9]{5}/),
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
