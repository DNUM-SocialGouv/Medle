import moment from "moment"

import { ISO_DATE } from "../utils/date"

// from Knex entity to model (JS) entity
export const transform = (knexData) => {
  return !knexData
    ? null
    : {
        asker: { id: knexData.asker_id, name: knexData.asker_name },
        examinationDate: moment(knexData.examination_date).format(ISO_DATE),
        hospital: { id: knexData.hospital_id, name: knexData.hospital_name },
        id: knexData.id,
        internalNumber: knexData.internal_number,
        profile: knexData.profile,
        pvNumber: knexData.pv_number,
        user: {
          email: knexData.user_email,
          firstName: knexData.user_first_name,
          id: knexData.added_by,
          lastName: knexData.user_last_name,
        },
        ...knexData.extra_data,
      }
}
// from Knex entity to model (JS) entity for export needs
export const transformForExport = (knexData) => {
  return !knexData
    ? null
    : {
        asker: knexData.asker_name,
        examinationDate: knexData.examination_date
          ? new Date(knexData.examination_date).toISOString().split("T")[0]
          : null,
        hospital: knexData.hospital_name,
        id: knexData.id,
        internalNumber: knexData.internal_number,
        profile: knexData.profile,
        pvNumber: knexData.pv_number,
        user: knexData.user_email,
        ...knexData.extra_data,
      }
}

export const transformAll = (list) => list.map((knexData) => transform(knexData))
export const transformAllForExport = (list) => list.map((knexData) => transformForExport(knexData))

// from model (JS) entity to Knex entity
export const untransform = (model) => {
  const knexData = { extra_data: {} }

  const mainKeys = {
    addedBy: "added_by",
    askerId: "asker_id",
    examinationDate: "examination_date",
    hospitalId: "hospital_id",
    id: "id",
    internalNumber: "internal_number",
    profile: "profile",
    pvNumber: "pv_number",
  }

  Object.keys(model).forEach((key) => {
    if (mainKeys[key]) {
      knexData[mainKeys[key]] = model[key]
    } else {
      knexData.extra_data[key] = model[key]
    }
  })

  return knexData
}
