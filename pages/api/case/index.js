import {
   STATUS_200_OK,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"
import knex from "../../../lib/knex/knex"

const getDataCase = data => ({
   internal_number: data.internalNumber,
   case_type: data.case_type,
})

const getDataRequest = data => ({
   pv_number: data.pvNumber,
   examination_date: data.examinationDate,
   asker: data.asker,
   data: JSON.stringify({
      examinationTypes: data.examinationTypes,
      violenceTypes: data.violenceTypes,
      periodOfDay: data.periodOfDay,
      extraExaminations: {
         biologicalExams: data.biologicalExams,
         imagingExams: data.imagingExams,
         boneExams: data.boneExams,
      },
      multipleVisits: data.multipleVisits,
   }),
})

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   if (req.method !== "POST") {
      console.error(`Méthode non permise ${STATUS_405_METHOD_NOT_ALLOWED}`)
      return res.status(STATUS_405_METHOD_NOT_ALLOWED).json({ message: "Méthode non permise" })
   }

   const data = await req.body

   const trx = await knex.transaction()

   trx("cases")
      .insert(getDataCase(data), "id")
      .then(ids => trx("cases_requests").insert({ ...getDataRequest(data), cases_fk: ids[0] }, "cases_fk"))
      .then(ids => {
         trx.commit()
         return res.status(STATUS_200_OK).json({ message: `Dossier envoyé`, detail: ids[0] })
      })
      .catch(error => {
         trx.rollback()
         console.error(JSON.stringify(error))
         return res
            .status(STATUS_500_INTERNAL_SERVER_ERROR)
            .json({ message: `Erreur serveur base de données`, detail: error })
      })
}
