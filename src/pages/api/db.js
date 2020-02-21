import knex from "../../knex/knex"
import { STATUS_200_OK } from "../../utils/http"
import { logError } from "../../utils/logger"

export default async (req, res) => {
   let columns

   try {
      // users = await knex("users").debug()
      columns = await knex.table("users").columnInfo()
   } catch (error) {
      logError("Erreur de requête")
   }

   res.status(STATUS_200_OK).json({ columns })
}
