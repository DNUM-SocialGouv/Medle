import {
   STATUS_200_OK,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"
import knex from "../../../lib/knex/knex"

const getDataActs = data => ({
   internal_number: data.internalNumber,
   examined_person_type: data.examinedPersonType,
   person_gender: data.personGender,
   person_age_tag: data.personAgeTag,
})

const getDataActsDetails = data => ({
   pv_number: data.pvNumber,
   examination_date: data.examinationDate,
   asker: data.asker,
   examination_type: data.examinationType,
   violence_type: data.violenceType,
   period_of_day: data.periodOfDay,
   doctor_work_status: data.doctorWorkStatus,
   blood_examination_number: data.bloodExaminationsNumber,
   xray_examination_number: data.xrayExaminationsNumber,
   bone_examination_number: data.boneExaminationNumber,
})

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   if (req.method !== "POST") {
      console.error(`Méthode non permise ${STATUS_405_METHOD_NOT_ALLOWED}`)
      return res.status(STATUS_405_METHOD_NOT_ALLOWED).json({ message: "Méthode non permise" })
   }

   const data = await req.body

   const trx = await knex.transaction()

   trx("acts")
      .insert(getDataActs(data), "id")
      .then(ids => trx("acts_details").insert({ ...getDataActsDetails(data), acts_id: ids[0] }, "acts_id"))
      .then(ids => {
         trx.commit()
         return res.status(STATUS_200_OK).json({ message: `Déclaration envoyée`, detail: ids[0] })
      })
      .catch(error => {
         trx.rollback()
         console.error(JSON.stringify(error))
         return res
            .status(STATUS_500_INTERNAL_SERVER_ERROR)
            .json({ message: `Erreur serveur base de données`, detail: error })
      })
}
