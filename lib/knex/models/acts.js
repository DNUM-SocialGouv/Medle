const getWithId = (arr, id) => arr.find(elt => elt.id === id)

export const buildActsFromDB = acts => {
   const res = []

   if (acts && acts.length) {
      acts.forEach(elt => {
         let act = getWithId(res, elt.id)

         if (!act) {
            act = {
               id: elt.id,
               internalNumber: elt.internal_number,
               createdAt: elt.created_at,
               updatedAt: elt.updated_at,
               deletedAt: elt.deleted_at,
               caseType: elt.case_type,
               requests: [],
            }
            res.push(act)
         }

         act.requests.push({
            id: elt.cases_requests_id,
            createdAt: elt.cases_requests_detail_created_at,
            updatedAt: elt.cases_requests_detail_updated_at,
            deletedAt: elt.cases_requests_detail_deleted_at,
            casesFk: elt.cases_fk,
            pvNumber: elt.pv_number,
            examinationDate: elt.examination_date,
            asker: elt.asker,
            addedBy: elt.added_by,
            data: elt.data,
         })
      })
   }

   return res
}

export const buildActFromDB = act => {
   if (!act) throw new Error("Données nécessaires non présente pour buildActFromDB")
   const res = buildActsFromDB([act])

   if (!res || !res.length || res.length !== 1) throw new Error("Pas de données cohérentes en sortie de buildActFromDB")

   return res[0]
}
