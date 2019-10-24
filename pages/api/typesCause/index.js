import knex from "../../../lib/knex/knexfile"
import { STATUS_200_OK, STATUS_404_NOT_FOUND, STATUS_500_INTERNAL_SERVER_ERROR } from "../../../utils/HttpStatus"

export default async (req, res) => {
   let types

   try {
      types = await knex("type_cause").select("*")
   } catch (err) {
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({ message: `Erreur de base de donnée / ${err}` })
   }

   if (types) {
      return res.status(STATUS_200_OK).json({ typesCause: types })
   } else {
      return res.status(STATUS_404_NOT_FOUND).end("")
   }
}
