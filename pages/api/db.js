import knex from "../../lib/knex/knexfile"
import { STATUS_200_OK } from "../../utils/HttpStatus"

export default async (req, res) => {
   let users

   try {
      users = await knex("users").debug()
   } catch (error) {
      console.error("Erreur de requête")
   }

   res.status(STATUS_200_OK).json({ users })
}
