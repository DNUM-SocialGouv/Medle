import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_404_NOT_FOUND,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"
import knex from "../../../lib/knex/knex"
import { buildActsFromDB, buildCaseFromDB } from "../../../lib/knex/models/acts_old"

export default async (req, res) => {
   if (!["GET", "UPDATE"].includes(req.method)) {
      console.error(`Méthode non permise ${STATUS_405_METHOD_NOT_ALLOWED}`)
      return res.status(STATUS_405_METHOD_NOT_ALLOWED).end()
   }

   res.setHeader("Content-Type", "application/json")

   if (req.method === "GET") {
      const { cid: id } = req.query

      if (!id || !/^[0-9]+$/.test(id)) {
         return res.status(STATUS_400_BAD_REQUEST).end()
      }

      let aCase, acts
      try {
         aCase = await knex("cases")
            .where("id", id)
            .first()

         if (aCase && aCase.id) {
            acts = await knex("acts")
               .where("cases_fk", aCase.id)
               .whereNull("deleted_at")
         }
      } catch (error) {
         return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
            error: `Erreur serveur base de données`,
            error_description: error,
            error_uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
         })
      }

      if (aCase) {
         const newCase = buildCaseFromDB(aCase)
         const newActs = buildActsFromDB(acts)

         return res.status(STATUS_200_OK).json({ ...newCase, acts: newActs })
      } else {
         return res.status(STATUS_404_NOT_FOUND).end()
      }
   }

   return res.status(STATUS_404_NOT_FOUND).end()
}
