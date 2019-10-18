import knex from "../../lib/knex/knexfile"

export default async (req, res) => {
   let users

   try {
      users = await knex("users").debug()
   } catch (error) {
      console.error("Erreur de requête")
   }

   res.status(200).json({ users })
}
