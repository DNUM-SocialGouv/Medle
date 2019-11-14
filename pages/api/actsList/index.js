import knex from "../../../lib/knex/knex"
import { STATUS_200_OK, STATUS_404_NOT_FOUND, STATUS_500_INTERNAL_SERVER_ERROR } from "../../../utils/HttpStatus"

export default async (req, res) => {
   let acts, result

   try {
      acts = await knex("acts as a1")
         .join("acts_details as a2", "a1.id", "a2.acts_id")
         .select([
            "a1.*",
            "a2.*",
            "a1.id as id",
            "a2.id as acts_detail_id",
            "a2.created_at as acts_detail_created_at",
            "a2.updated_at as acts_detail_updated_at",
            "a2.deleted_at as acts_detail_deleted_at",
         ])

      result = acts.reduce((prev, curr) => {
         prev.set(curr.internal_number, {
            id: curr.id,
            internal_number: curr.internal_number,
            created_at: curr.created_at,
            updated_at: curr.updated_at,
            deleted_at: curr.deleted_at,
            examined_person_type: curr.examined_person_type,
            person_gender: curr.person_gender,
            person_age_tag: curr.person_age_tag,
            details: [],
         })
         return prev
      }, new Map())

      acts.forEach(elt => {
         const details = result.get(elt.internal_number).details

         details.push({
            id: elt.acts_detail_id,
            created_at: elt.acts_detail_created_at,
            updated_at: elt.acts_detail_updated_at,
            deleted_at: elt.acts_detail_deleted_at,
            pv_number: elt.pv_number,
            examination_date: elt.examination_date,
            asker: elt.asker,
            examination_types: elt.examination_types,
            violence_types: elt.violence_types,
            period_of_day: elt.period_of_day,
            doctor_work_status: elt.doctor_work_status,
            blood_examination_number: elt.blood_examination_number,
            xray_examination_number: elt.xray_examination_number,
            bone_examination_number: elt.bone_examination_number,
            multiple_visits: elt.multiple_visits,
            added_by: elt.added_by,
            acts_id: elt.acts_id,
         })
      })

      result = Array.from(result).map(elt => elt[1])
   } catch (err) {
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({ message: `Erreur de base de donnée / ${err}` })
   }

   if (result) {
      return res.status(STATUS_200_OK).json(result)
   } else {
      return res.status(STATUS_404_NOT_FOUND).end("")
   }
}
