import {
   STATUS_201_CREATED,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"
import knex from "../../../lib/knex/knex"

const getCaseData = data => ({
   internal_number: data.internalNumber,
   case_type: data.caseType,
   ets_id: data.etsId,
   data: JSON.stringify(data.commonData),
})

export default async (req, res) => {
   if (req.method !== "POST") {
      console.error(`Méthode non permise ${STATUS_405_METHOD_NOT_ALLOWED}`)
      return res.status(STATUS_405_METHOD_NOT_ALLOWED).end()
   }

   res.setHeader("Content-Type", "application/json")

   const data = await req.body

   // const trx = await knex.transaction()

   // trx("cases")
   //    .insert(getCaseData(data), "id")
   //    .then(ids => trx("cases_requests").insert({ ...getDataRequest(data), cases_fk: ids[0] }, "cases_fk"))
   //    .then(ids => {
   //       trx.commit()
   //       res.setHeader("Location", `/api/case/${ids[0]}`)
   //       return res.status(STATUS_201_CREATED).json({ message: `Dossier envoyé`, detail: ids[0] })
   //    })
   //    .catch(error => {
   //       trx.rollback()
   //       console.error(JSON.stringify(error))
   //       return res
   //          .status(STATUS_500_INTERNAL_SERVER_ERROR)
   //          .json({ message: `Erreur serveur base de données`, detail: error })
   //    })

   try {
      const result = await knex("cases").insert(getCaseData(data), "id")
      res.setHeader("Location", `/api/cases/${result[0]}`)
      return res.status(STATUS_201_CREATED).json({ message: `Dossier envoyé`, detail: result[0] })
   } catch (error) {
      console.error(JSON.stringify(error))
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
         error: `Erreur serveur base de données`,
         error_description: error,
         error_uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
      })
   }
}
