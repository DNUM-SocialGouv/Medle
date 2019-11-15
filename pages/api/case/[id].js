import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_404_NOT_FOUND,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"
import knex from "../../../lib/knex/knex"
import { buildActFromDB } from "../../../lib/knex/models/acts"

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   if (!["GET", "UPDATE"].includes(req.method)) {
      console.error(`Méthode non permise ${STATUS_405_METHOD_NOT_ALLOWED}`)
      return res.status(STATUS_405_METHOD_NOT_ALLOWED).json({ message: "Méthode non permise" })
   }

   if (req.method === "GET") {
      const { id } = req.query

      if (!id) {
         return res.status(STATUS_400_BAD_REQUEST).end("")
      }

      let act
      try {
         act = await knex("cases as a1")
            .join("cases_requests as a2", "a1.id", "a2.cases_fk")
            .select([
               "a1.*",
               "a2.*",
               "a2.id as cases_requests_id",
               "a2.created_at as cases_requests_detail_created_at",
               "a2.updated_at as cases_requests_detail_updated_at",
               "a2.deleted_at as cases_requests_detail_deleted_at",
            ])
            .where("a1.id", id)
            .first()
      } catch (err) {
         return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({ message: `Erreur de base de donnée / ${err}` })
      }

      if (act) {
         const newAct = buildActFromDB(act)
         return res.status(STATUS_200_OK).json(newAct)
      } else {
         return res.status(STATUS_404_NOT_FOUND).end("")
      }
   }

   return res.status(STATUS_404_NOT_FOUND).end("ERREUR WEIRD")
}
