import {
   STATUS_200_OK,
   STATUS_401_UNAUTHORIZED,
   STATUS_403_FORBIDDEN,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "./http"
import { isAllowed, NO_PRIVILEGE_REQUIRED } from "./roles"
import { checkToken, decodeToken } from "./jwt"
import { APIError } from "./errors"

// see Micro.sendError
export const sendError = (req, res, error) => {
   const statusCode = error.statusCode || error.status
   const message = statusCode ? error.message : "Internal Server Error"

   res.status(statusCode || STATUS_500_INTERNAL_SERVER_ERROR).json({ message })

   if (error instanceof Error) {
      console.error(error.stack)
   } else {
      console.warn("thrown error must be an instance Error")
   }
}

export const sendSuccess = (req, res) => res.status(STATUS_200_OK)

// see Micro.createError
export const createError = (code, message, original) => {
   const error = new Error(message)

   error.statusCode = code
   error.originalError = original

   return error
}

export const sendAPIError = (error, res) => {
   if (error instanceof APIError) {
      return res.status(error.status).json(error)
   }
   // fallback error
   return res
      .status(STATUS_500_INTERNAL_SERVER_ERROR)
      .json({ message: `Erreur de base de donnée / ${error}`, status: STATUS_500_INTERNAL_SERVER_ERROR })
}

export const checkValidUserWithPrivilege = (privilege, req) => {
   const { token } = req.cookies

   try {
      if (!token) {
         throw new APIError({
            message: "Non authentified user",
            status: STATUS_401_UNAUTHORIZED,
         })
      }

      const currentUser = checkToken(token)

      if (privilege !== NO_PRIVILEGE_REQUIRED && !isAllowed(currentUser.role, privilege)) {
         throw new APIError({
            message: `Not allowed role  (${currentUser.email ? currentUser.email : "unknown user"})`,
            status: STATUS_403_FORBIDDEN,
         })
      } else {
         return currentUser
      }
   } catch (error) {
      let email
      try {
         // Let's try to get user informations even if the token is not valid
         const currentUser = decodeToken(token)
         email = currentUser.email
      } catch (error) {
         console.error("Token couldn't been decoded")
      }
      throw new APIError({
         message: `Invalid token for user (${email ? email : "unknown user"})`,
         status: STATUS_401_UNAUTHORIZED,
      })
   }
}

export const sendMethodNotAllowedError = res => {
   return res.status(STATUS_405_METHOD_NOT_ALLOWED).end()
}
