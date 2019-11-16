import knex from "../../../lib/knex/knex"
import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_404_NOT_FOUND,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"

export default async (req, res) => {
   let act

   const { id } = req.query

   if (!id) {
      return res.status(STATUS_400_BAD_REQUEST).end()
   }

   try {
      act = await knex("acts as a1")
         .join("acts_details as a2", "a1.id", "a2.acts_id")
         .select([
            "a1.*",
            "a2.*",
            "a2.id as acts_detail_id",
            "a2.created_at as acts_detail_created_at",
            "a2.updated_at as acts_detail_updated_at",
            "a2.deleted_at as acts_detail_deleted_at",
         ])
         .where("a1.id", id)
   } catch (err) {
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({ message: `Erreur de base de donnée / ${err}` })
   }

   if (act) {
      return res.status(STATUS_200_OK).json({ act })
   } else {
      return res.status(STATUS_404_NOT_FOUND).end()
   }
}
