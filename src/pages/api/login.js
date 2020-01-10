import knex from "../../knex/knex"
import { compareWithHash } from "../../utils/bcrypt"
import { generateToken } from "../../utils/jwt"

import { STATUS_200_OK, STATUS_400_BAD_REQUEST, STATUS_401_UNAUTHORIZED, METHOD_POST } from "../../utils/http"
import { sendAPIError, checkHttpMethod } from "../../utils/api"

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
   res.setHeader("Content-Type", "application/json")

   try {
      // 1 methods verification
      checkHttpMethod([METHOD_POST], req, res)

      // 2 request verification
      const { email, password } = await req.body

      if (!validPassword(password)) {
         return res.status(STATUS_400_BAD_REQUEST).json({ message: "Incorrect password" })
      }

      // 3 SQL query
      const user = await knex("users")
         .where("email", email)
         .whereNull("deleted_at")
         .first()

      if (user && (await compareWithHash(password, user.password))) {
         const token = generateToken(user)

         res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly; Max-Age=${maxDurationCookies}`)
         res.status(STATUS_200_OK).json(extractPublicData(user))
         // res.status(STATUS_200_OK).json({ token })
      } else {
         // 4 Unauthorized path
         return res.status(STATUS_401_UNAUTHORIZED).json({
            error: {
               message: "Erreur d'authentification",
            },
         })
      }
   } catch (error) {
      // 5 DB error
      console.error("API error", JSON.stringify(error))
      sendAPIError(error, res)
   }
}
