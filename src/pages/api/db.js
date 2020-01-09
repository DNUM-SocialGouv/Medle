import knex from "../../knex/knex"
import { STATUS_200_OK } from "../../utils/http"

export default async (req, res) => {
   let columns

   try {
      // users = await knex("users").debug()
      columns = await knex.table("users").columnInfo()
   } catch (error) {
      console.error("Erreur de requête")
   }

   res.status(STATUS_200_OK).json({ columns })
}
