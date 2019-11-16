import knex from "../../../lib/knex/knex"
import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_404_NOT_FOUND,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"

export const validate = input => (/^[0-9]*$/.test(input) ? parseInt(input, 10) : false)

export default async (req, res) => {
   if (req.query.id) {
      const id = validate(req.query.id)

      if (!id) {
         return res.status(STATUS_400_BAD_REQUEST).end()
      }

      let type

      try {
         type = await knex("type_cause")
            .where("id", id)
            .first()
      } catch (err) {
         return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({ message: `Erreur de base de données / ${err}` })
      }

      if (type) {
         return res.status(STATUS_200_OK).json({ typesCause: [type] })
      } else {
         return res.status(STATUS_404_NOT_FOUND).end()
      }
   } else {
      return res.status(STATUS_404_NOT_FOUND).end()
   }
}
