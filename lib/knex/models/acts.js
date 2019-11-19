import moment from "moment"
import { FORMAT_DATE } from "../../../utils/constants"

export const buildCaseFromDB = aCase => {
   return {
      id: aCase.id,
      internalNumber: aCase.internal_number,
      createdAt: aCase.created_at,
      updatedAt: aCase.updated_at,
      deletedAt: aCase.deleted_at,
      caseType: aCase.case_type,
      etsId: aCase.ets_id,
      acts: [],
   }
}
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

export const buildActFromDB = act => {
   if (!act) throw new Error("Données nécessaires non présente pour buildActFromDB")
   const res = buildActsFromDB([act])

   if (!res || !res.length || res.length !== 1) throw new Error("Pas de données cohérentes en sortie de buildActFromDB")

   return res[0]
}

export const buildActFromJSON = data => ({
   cases_fk: data.casesFk,
   pv_number: data.pvNumber,
   examination_date: moment(data.examinationDate).parse(FORMAT_DATE),
   asker: data.asker,
   added_by: data.addedBy,
   data: JSON.stringify(data.data),
})
