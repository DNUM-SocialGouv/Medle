import {
   STATUS_201_CREATED,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../../../utils/HttpStatus"
import knex from "../../../../../lib/knex/knex"

import { buildActFromJSON } from "../../../../../lib/knex/models/acts"

// {
//    examinationTypes: data.examinationTypes,
//    violenceTypes: data.violenceTypes,
//    periodOfDay: data.periodOfDay,
//    extraExaminations: {
//       biologicalExams: data.biologicalExams,
//       imagingExams: data.imagingExams,
//       boneExams: data.boneExams,
//    },
//    multipleVisits: data.multipleVisits,
// }
export default async (req, res) => {
   if (req.method !== "POST") {
      console.error(`Méthode non permise ${STATUS_405_METHOD_NOT_ALLOWED}`)
      return res.status(STATUS_405_METHOD_NOT_ALLOWED).end()
   }

   res.setHeader("Content-Type", "application/json")

   const data = await req.body
   const { cid } = req.query

   try {
      const result = await knex("acts").insert(buildActFromJSON({ ...data, casesFk: cid }), "id")
      res.setHeader("Location", `/api/cases/${cid}/acts/${result[0]}`)
      return res.status(STATUS_201_CREATED).json({ message: `Acte créé`, detail: result[0] })
   } catch (error) {
      console.error(JSON.stringify(error))
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
         error: `Erreur serveur base de données`,
         error_description: error,
         error_uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
      })
   }
}
