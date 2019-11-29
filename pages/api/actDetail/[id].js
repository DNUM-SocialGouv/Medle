import knex from "../../../lib/knex/knex"
import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_404_NOT_FOUND,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"
import { buildActFromDB } from "../../../lib/knex/models/acts"

export default async (req, res) => {
   let act

   const { id } = req.query

   if (!id) {
      return res.status(STATUS_400_BAD_REQUEST).end()
   }

   try {
      act = await knex("acts")
         .where("id", id)
         .first()
   } catch (err) {
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({ message: `Erreur de base de donnée / ${err}` })
   }

   if (act) {
      return res.status(STATUS_200_OK).json(buildActFromDB(act))
   } else {
      return res.status(STATUS_404_NOT_FOUND).end()
   }
}
