import moment from "moment"
import { FORMAT_DATE } from "../../../utils/constants"

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

// export const buildActFromDB = act => {
//    if (!act) throw new Error("Données nécessaires non présente pour buildActFromDB")
//    const res = buildActsFromDB([act])

//    if (!res || !res.length || res.length !== 1) throw new Error("Pas de données cohérentes en sortie de buildActFromDB")

//    return res[0]
// }

// export const buildActFromJSON = data => ({
//    cases_fk: data.casesFk,
//    pv_number: data.pvNumber,
//    examination_date: moment(data.examinationDate).parse(FORMAT_DATE),
//    asker: data.asker,
//    added_by: data.addedBy,
//    data: JSON.stringify(data.data),
// })

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
   askerId: data.asker_id,
   addedBy: data.added_by,
   hospitalId: data.hospital_id,
   ...data.extra_data,
})
