import knex from "../../knex/knex"
import { compareWithHash } from "../../utils/bcrypt"

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
         .first()
   } catch (error) {
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
         error: {
            message: "Erreur serveur base de données",
            detail: error,
         },
      })
   }

   if (user && (await compareWithHash(password, user.password))) {
      return res.status(STATUS_200_OK).json({
         token: "1234",
         userId: user.id,
         role: user.role,
         hospitalId: user.hospital_id,
         scope: user.scope ? JSON.stringify(user.scope) : "",
      })
   } else {
      return res.status(STATUS_401_UNAUTHORIZED).json({
         error: {
            message: "Erreur d'authentification",
         },
      })
   }
}
