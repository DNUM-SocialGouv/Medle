import knex from "../../lib/knex/knexfile"
import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_401_UNAUTHORIZED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../utils/HttpStatus"

const validPassword = password => {
   return password.length
}

export default async (req, res) => {
   const { email, password } = await req.body

   if (!validPassword(password)) {
      return res.status(STATUS_400_BAD_REQUEST).json({ message: "Incorrect password" })
   }

   let user

   try {
      user = await knex("users")
         .where("email", email)
         .andWhere("password", password)
         .first()
   } catch (error) {
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({ message: "Erreur serveur base de données" })
   }

   if (user) {
      return res.status(STATUS_200_OK).json({ token: "1234", role: user.role })
   } else {
      return res.status(STATUS_401_UNAUTHORIZED).json({ message: "Erreur d'authenfication" })
   }
}
