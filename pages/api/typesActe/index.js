import knex from "../../../lib/knex/knex"
import { STATUS_200_OK, STATUS_404_NOT_FOUND, STATUS_500_INTERNAL_SERVER_ERROR } from "../../../utils/HttpStatus"

export default async (req, res) => {
   let types

   try {
      types = await knex("type_acte").select("*")
   } catch (err) {
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({ message: `Erreur de base de donnée / ${err}` })
   }

   if (types) {
      return res.status(STATUS_200_OK).json({ typesActe: types })
   } else {
      return res.status(STATUS_404_NOT_FOUND).end()
   }
}
