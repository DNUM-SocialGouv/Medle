import knex from "../../knex/knex"
import { compareWithHash } from "../../utils/bcrypt"
import { generateToken } from "../../utils/jwt"

import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_401_UNAUTHORIZED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../utils/HttpStatus"

const validPassword = password => {
   return password.length
}

const maxDurationCookies = 2 * 60 * 60 // 2 heures max. TODO: mettre en confi (cf. expiration JWT)

const extractPublicData = ({
   id,
   first_name: firstName,
   last_name: lastName,
   email,
   role,
   hospital_id: hospitalId,
   scope,
}) => ({
   id,
   firstName,
   lastName,
   email,
   role,
   hospitalId,
   scope,
})

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

   const token = generateToken(user)

   if (user && (await compareWithHash(password, user.password))) {
      res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly; Max-Age=${maxDurationCookies}`)
      res.status(STATUS_200_OK).json(extractPublicData(user))
      // res.status(STATUS_200_OK).json({ token })
   } else {
      return res.status(STATUS_401_UNAUTHORIZED).json({
         error: {
            message: "Erreur d'authentification",
         },
      })
   }
}
