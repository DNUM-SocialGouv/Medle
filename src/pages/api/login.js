import Cors from "micro-cors"

import knex from "../../knex/knex"
import { compareWithHash } from "../../utils/bcrypt"
import { generateToken } from "../../utils/jwt"
import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_401_UNAUTHORIZED,
   METHOD_OPTIONS,
   METHOD_POST,
} from "../../utils/http"
import { sendAPIError } from "../../utils/api"
import { timeout } from "../../utils/auth"

const validPassword = password => {
   return password.length
}

// const maxDurationCookies = 7 * 60 * 60 // 7 heures max. TODO: mettre en config (cf. expiration JWT)
const maxDurationCookies = timeout.cookie

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

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // request verification
      const { email, password } = await req.body

      if (!validPassword(password)) {
         return res.status(STATUS_400_BAD_REQUEST).json({ message: "Incorrect password" })
      }

      // SQL query
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
         // Unauthorized path
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

const cors = Cors({
   allowMethods: [METHOD_POST, METHOD_OPTIONS],
})

export default cors(handler)
