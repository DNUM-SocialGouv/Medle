import {
   STATUS_200_OK,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"
import knex from "../../../lib/knex/knexfile"

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")
   if (req.method !== "POST") {
      console.error(`Méthode non permise ${STATUS_405_METHOD_NOT_ALLOWED}`)
      res.status(STATUS_405_METHOD_NOT_ALLOWED).json({ message: "Méthode non permise" })
   }

   const data = await req.body

   try {
      await knex("acte").insert(data)
   } catch (error) {
      console.error(JSON.stringify(error))
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({ message: `Erreur serveur base de données` })
   }
   return res.status(STATUS_200_OK).json({ message: `Déclaration envoyée` })
}
