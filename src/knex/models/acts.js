import moment from "moment"

export const buildActsFromDB = acts =>
   acts.map(elt => ({
      id: elt.id,
      createdAt: elt.created_at,
      updatedAt: elt.updated_at,
      deletedAt: elt.deleted_at,
      casesFk: elt.cases_fk,
      pvNumber: elt.pv_number,
      examinationDate: elt.examination_date,
      asker: elt.asker,
      addedBy: elt.added_by,
      data: elt.data,
   }))

// from js to db
export const buildActFromJSON = data => {
   const res = { extra_data: {} }

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

   Object.keys(data).forEach(key => {
      if (mainKeys[key]) {
         res[mainKeys[key]] = data[key]
      } else {
         res.extra_data[key] = data[key]
      }
   })

   return res
}

// from db to js
export const buildActFromDB = data => ({
   id: data.id,
   internalNumber: data.internal_number,
   pvNumber: data.pv_number,
   examinationDate: moment(data.examination_date).format("YYYY-MM-DD"),
   profile: data.profile,
   asker: { id: data.asker_id, name: data.asker_name },
   user: {
      id: data.added_by,
      firstName: data.user_first_name,
      lastName: data.user_last_name,
      email: data.user_email,
   },
   hospital: { id: data.hospital_id, name: data.hospital_name },
   ...data.extra_data,
})
