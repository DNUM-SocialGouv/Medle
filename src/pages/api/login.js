import cors from "micro-cors"
import nextConnect from "next-connect"

import knex from "../../knex/knex"
import { compareWithHash } from "../../utils/bcrypt"
import { generateToken } from "../../utils/jwt"
import {
   STATUS_400_BAD_REQUEST,
   STATUS_401_UNAUTHORIZED,
   STATUS_405_METHOD_NOT_ALLOWED,
   METHOD_OPTIONS,
   METHOD_POST,
} from "../../utils/http"
import { createError, sendError, sendSuccess } from "../../utils/api"
import { timeout } from "../../config"
import { logError } from "../../utils/logger"

const validPassword = password => {
   return password.length
}

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

function onError(err, req, res) {
   sendError(req, res, err)
}

function onNoMatch(req, res) {
   logError("req", req)
   return sendError(req, res, createError(STATUS_405_METHOD_NOT_ALLOWED, "Method not allowed"))
}

const handler = nextConnect({ onError, onNoMatch })

const handleOptionsMethod = (req, res, next) => {
   if (req.method === METHOD_OPTIONS) res.end()
   else next()
}

const handleCORS = (req, res, next) => {
   cors({ allowMethods: [METHOD_POST, METHOD_OPTIONS] })(req, res)
   next()
}

handler
   .use(handleCORS)
   .use(handleOptionsMethod)
   .post(async (req, res) => {
      res.setHeader("Content-Type", "application/json")

      try {
         // request verification
         const { email, password } = await req.body

         if (!validPassword(password)) {
            return res.status(STATUS_400_BAD_REQUEST).json({ message: "Incorrect password" })
         }

         // SQL query
         const [user] = await knex("users")
            .where("email", email)
            .whereNull("deleted_at")

         if (user && (await compareWithHash(password, user.password))) {
            const token = generateToken(user)

            res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly; Max-Age=${timeout.cookie}`)
            return sendSuccess(req, res).json(extractPublicData(user))
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
         return sendError(req, res, error)
      }
   })

export default handler
