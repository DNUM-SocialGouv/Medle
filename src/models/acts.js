import moment from "moment"
import { ISO_DATE } from "../utils/date"

// from Knex entity to model (JS) entity
export const transform = knexData => {
   return !knexData
      ? null
      : {
           id: knexData.id,
           internalNumber: knexData.internal_number,
           pvNumber: knexData.pv_number,
           examinationDate: moment(knexData.examination_date).format(ISO_DATE),
           profile: knexData.profile,
           asker: { id: knexData.asker_id, name: knexData.asker_name },
           user: {
              id: knexData.added_by,
              firstName: knexData.user_first_name,
              lastName: knexData.user_last_name,
              email: knexData.user_email,
           },
           hospital: { id: knexData.hospital_id, name: knexData.hospital_name },
           ...knexData.extra_data,
        }
}
// from Knex entity to model (JS) entity for export needs
export const transformForExport = knexData => {
   return !knexData
      ? null
      : {
           id: knexData.id,
           internalNumber: knexData.internal_number,
           pvNumber: knexData.pv_number,
           examinationDate: moment(knexData.examination_date).format(ISO_DATE),
           profile: knexData.profile,
           asker: knexData.asker_name,
           user: knexData.user_email,
           hospital: knexData.hospital_name,
           ...knexData.extra_data,
        }
}

export const transformAll = list => list.map(knexData => transform(knexData))
export const transformAllForExport = list => list.map(knexData => transformForExport(knexData))

// from model (JS) entity to Knex entity
export const untransform = model => {
   const knexData = { extra_data: {} }

   const mainKeys = {
      id: "id",
      internalNumber: "internal_number",
      pvNumber: "pv_number",
      examinationDate: "examination_date",
      profile: "profile",
      askerId: "asker_id",
      addedBy: "added_by",
      hospitalId: "hospital_id",
   }

   Object.keys(model).forEach(key => {
      if (mainKeys[key]) {
         knexData[mainKeys[key]] = model[key]
      } else {
         knexData.extra_data[key] = model[key]
      }
   })

   return knexData
}
