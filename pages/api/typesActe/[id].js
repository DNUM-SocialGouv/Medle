import knex from "../../../lib/knex/knexfile"

export const validate = input => (/^[0-9]*$/.test(input) ? parseInt(input, 10) : false)

export default async (req, res) => {
   if (req.query.id) {
      const id = validate(req.query.id)

      if (!id) {
         return res.status(400).end()
      }

      let type

      try {
         type = await knex("type_acte")
            .where("id", id)
            .first()
      } catch (err) {
         return res.status(500).json({ message: `Erreur de base de données / ${err}` })
      }

      if (type) {
         return res.status(200).json({ typesActe: [type] })
      } else {
         return res.status(404).end("")
      }
   } else {
      return res.status(404).end("")
   }
}
