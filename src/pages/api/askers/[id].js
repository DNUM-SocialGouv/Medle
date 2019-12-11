import knex from "../../../knex/knex"
import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_404_NOT_FOUND,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"

export default async (req, res) => {
   let askers

   const { id } = req.query

   if (!id) {
      return res.status(STATUS_400_BAD_REQUEST).end()
   }

   try {
      askers = await knex("askers")
         .where("id", id)
         .first()
   } catch (err) {
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({ message: `Erreur de base de donnée / ${err}` })
   }

   if (askers) {
      return res.status(STATUS_200_OK).json(askers)
   } else {
      return res.status(STATUS_404_NOT_FOUND).end()
   }
}
