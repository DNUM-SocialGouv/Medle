import knex from "../../lib/knex/knexfile"

const validPassword = password => {
   return password.length
}

export default async (req, res) => {
   const { email, password } = await req.body

   if (!validPassword(password)) {
      return res.status(400).json({ message: "Incorrect password" })
   }

   let user

   try {
      user = await knex("users")
         .where("email", email)
         .andWhere("password", password)
         .first()
   } catch (error) {
      return res.status(500).json({ message: "Erreur serveur base de données" })
   }

   if (user) {
      return res.status(200).json({ token: "1234", role: user.role })
   } else {
      return res.status(401).json({ message: "Erreur d'authenfication" })
   }
}
