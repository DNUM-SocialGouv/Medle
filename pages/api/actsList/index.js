import knex from "../../../lib/knex/knex"
import { STATUS_200_OK, STATUS_404_NOT_FOUND, STATUS_500_INTERNAL_SERVER_ERROR } from "../../../utils/HttpStatus"

export default async (req, res) => {
   let acts

   try {
      acts = await knex("acts")
         .join("acts_details", "acts.id", "acts_details.acts_id")
         .select("*")
   } catch (err) {
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({ message: `Erreur de base de donnée / ${err}` })
   }

   if (acts) {
      return res.status(STATUS_200_OK).json({ acts })
   } else {
      return res.status(STATUS_404_NOT_FOUND).end("")
   }
}
