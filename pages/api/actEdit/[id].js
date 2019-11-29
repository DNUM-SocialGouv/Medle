import {
   STATUS_200_OK,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"
import knex from "../../../lib/knex/knex"
import { buildActFromJSON } from "../../../lib/knex/models/acts"

export default async (req, res) => {
   const { id } = req.query

   res.setHeader("Content-Type", "application/json")

   if (req.method !== "POST") {
      console.error(`Méthode non permise ${STATUS_405_METHOD_NOT_ALLOWED}`)
      return res.status(STATUS_405_METHOD_NOT_ALLOWED).json({ message: "Méthode non permise" })
   }

   const data = await req.body

   knex("acts")
      .update(buildActFromJSON(data))
      .where("id", id)
      .then(() => {
         return res.status(STATUS_200_OK).json({ message: `Acte ${id} modifié` })
      })
      .catch(error => {
         console.error(JSON.stringify(error))

         return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
            error: `Erreur serveur base de données`,
            error_description: error,
            error_uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
         })
      })
}
