import {
   STATUS_204_NO_CONTENT,
   STATUS_400_BAD_REQUEST,
   STATUS_404_NOT_FOUND,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../../../utils/HttpStatus"
import knex from "../../../../../lib/knex/knex"
import { buildActFromJSON } from "../../../../../lib/knex/models/acts"

export default async (req, res) => {
   if (!["DELETE", "PUT"].includes(req.method)) {
      console.error(`Méthode non permise ${STATUS_405_METHOD_NOT_ALLOWED}`)
      return res.status(STATUS_405_METHOD_NOT_ALLOWED).end()
   }

   const { aid, cid } = req.query

   if (!aid || !cid || !/^[0-9]+$/.test(aid) || !/^[0-9]+$/.test(cid)) {
      return res.status(STATUS_400_BAD_REQUEST).end()
   }

   res.setHeader("Content-Type", "application/json")

   try {
      if (req.method === "DELETE") {
         const count = await knex("acts")
            .where({
               id: aid,
               cases_fk: cid,
            })
            .whereNull("deleted_at")
            .update({ deleted_at: knex.fn.now() })

         return count === 1 ? res.status(STATUS_204_NO_CONTENT).end() : res.status(STATUS_404_NOT_FOUND).end()
      } else if (req.method === "PUT") {
         const data = await req.body

         const result = await knex("acts")
            .where({
               id: aid,
               cases_fk: cid,
            })
            .whereNull("deleted_at")
            .update({ ...buildActFromJSON(data), cases_fk: cid, updated_at: knex.fn.now() }, "id")

         return result[0] ? res.status(STATUS_204_NO_CONTENT).end() : res.status(STATUS_404_NOT_FOUND).end()
      }
   } catch (error) {
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
         error: `Erreur serveur base de données`,
         error_description: error,
         error_uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
      })
   }
}
