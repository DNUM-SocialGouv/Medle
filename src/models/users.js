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

export const transformAll = list => list.map(memData => transform(memData))

// from JS entity to DB entity
export const untransform = memData => {
   const res = {
      first_name: memData.firstName,
      last_name: memData.lastName,
      password: memData.password || "defaultpassword",
      email: memData.email,
      role: memData.role,
      scope:
         !memData.scope || !memData.scope.length
            ? null
            : JSON.stringify(memData.scope.map(curr => parseInt(curr.id, 10))), // Array needs to be explicitly stringified in PG
      hospital_id: (memData.hospital && memData.hospital.id) || null,
   }

   // Pas d'id pour une création de user
   if (memData.id) res.id = memData.id
   return res
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

export const validate = async user => {
   try {
      const value = await schema.validate(user, configValidate)
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

export const cast = async user => await schema.cast(user)
