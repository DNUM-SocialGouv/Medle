import * as yup from "yup"
import { logError } from "../utils/logger"
import { APIError } from "../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../utils/http"

// from DB entity to JS entity
export const transform = dbData => {
   return !dbData
      ? null
      : {
           ...dbData.extra_data,
           id: dbData.id,
           finesseNumber: dbData.finesse_number,
           name: dbData.name,
           addr1: dbData.addr1,
           addr2: dbData.addr2,
           town: dbData.town,
           depCode: dbData.dep_code,
           postalCode: dbData.postal_code,
        }
}

export const transformAll = list => list.map(jsData => transform(jsData))

// from JS entity to DB entity
export const untransform = jsData => {
   const dbData = { extra_data: {} }

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

   Object.keys(jsData).forEach(key => {
      if (predefinedKeys[key]) {
         dbData[predefinedKeys[key]] = jsData[key]
      } else {
         dbData.extra_data[key] = jsData[key]
      }
   })

   // Pas d'id pour une création de user
   if (!jsData.id) delete dbData.id
   return dbData
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

export const validate = async jsData => {
   try {
      const value = await schema.validate(jsData, configValidate)
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

export const cast = async jsData => await schema.cast(jsData)
