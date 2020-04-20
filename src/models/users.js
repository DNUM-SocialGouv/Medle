import * as yup from "yup"
import { logError } from "../utils/logger"
import { APIError } from "../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../utils/http"

// from DB entity to JS entity
export const transform = dbData => {
   return !dbData
      ? null
      : {
           id: dbData.id,
           firstName: dbData.first_name,
           lastName: dbData.last_name,
           email: dbData.email,
           role: dbData.role,
           scope: dbData.scope,
           hospital: !dbData.hospital_id
              ? null
              : {
                   id: dbData.hospital_id,
                   name: dbData.hospital_name || "",
                },
        }
}

export const transformAll = list => list.map(jsData => transform(jsData))

// from JS entity to DB entity
export const untransform = jsData => {
   const dbData = {
      first_name: jsData.firstName,
      last_name: jsData.lastName,
      email: jsData.email,
      role: jsData.role,
      scope:
         !jsData.scope || !jsData.scope.length ? null : JSON.stringify(jsData.scope.map(curr => parseInt(curr.id, 10))), // Array needs to be explicitly stringified in PG
      hospital_id: (jsData.hospital && jsData.hospital.id) || null,
   }

   // Pas d'id pour une création de user
   if (jsData.id) dbData.id = jsData.id
   if (jsData.password) dbData.password = jsData.password

   return dbData
}

const schema = yup.object().shape({
   id: yup
      .number()
      .positive()
      .integer()
      .nullable(),
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
         id: yup
            .number()
            .positive()
            .integer(),
         name: yup.string(),
      })
      .nullable(),
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
