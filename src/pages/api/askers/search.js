import {
   STATUS_200_OK,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"
import knex from "../../../knex/knex"

export default async (req, res) => {
   if (req.method !== "GET") {
      console.error(`Méthode non permise ${STATUS_405_METHOD_NOT_ALLOWED}`)
      return res.status(STATUS_405_METHOD_NOT_ALLOWED).end()
   }

   const { scope: cookieScope } = req.cookies

   console.log("cookies", cookieScope)

   res.setHeader("Content-Type", "application/json")

   const { fuzzy } = req.query

   let acts

   try {
      acts = await knex("askers")
         .whereNull("deleted_at")
         .where("name", "ilike", `%${fuzzy}%`)
         .orderBy("name")
         .select("id", "name")

      return res.status(STATUS_200_OK).json(acts)
   } catch (error) {
      console.error(error)
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
         error: `Erreur serveur base de données`,
         message: error,
         uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
      })
   }
}
