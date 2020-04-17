import moment from "moment"
import { ISO_DATE } from "../utils/date"

// from DB entity to JS entity
export const transform = dbData => {
   return !dbData
      ? null
      : {
           id: dbData.id,
           internalNumber: dbData.internal_number,
           pvNumber: dbData.pv_number,
           examinationDate: moment(dbData.examination_date).format(ISO_DATE),
           profile: dbData.profile,
           asker: { id: dbData.asker_id, name: dbData.asker_name },
           user: {
              id: dbData.added_by,
              firstName: dbData.user_first_name,
              lastName: dbData.user_last_name,
              email: dbData.user_email,
           },
           hospital: { id: dbData.hospital_id, name: dbData.hospital_name },
           ...dbData.extra_data,
        }
}

export const transformAll = list => list.map(jsData => transform(jsData))

// from JS entity to DB entity
export const untransform = jsData => {
   const dbData = { extra_data: {} }

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

   Object.keys(jsData).forEach(key => {
      if (mainKeys[key]) {
         dbData[mainKeys[key]] = jsData[key]
      } else {
         dbData.extra_data[key] = jsData[key]
      }
   })

   return dbData
}
