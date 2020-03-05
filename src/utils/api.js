import {
   STATUS_200_OK,
   STATUS_401_UNAUTHORIZED,
   STATUS_403_FORBIDDEN,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "./http"
import { isAllowed } from "./roles"
import { checkToken, decodeToken } from "./jwt"
import { APIError, stringifyError } from "./errors"
import { logError } from "./logger"

// see Micro.sendError
export const sendError = (req, res, error) => {
   const statusCode = error.statusCode || error.status
   const message = statusCode ? error.message : "Internal Server Error"

   res.status(statusCode || STATUS_500_INTERNAL_SERVER_ERROR).json({ message })

   if (error instanceof Error) {
      logError(error.stack)
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
   logError(error)

   if (error instanceof APIError) {
      return res.status(error.status).json(stringifyError(error))
   }
   // fallback error
   return res
      .status(STATUS_500_INTERNAL_SERVER_ERROR)
      .json({ message: `Erreur serveur / ${error}`, status: STATUS_500_INTERNAL_SERVER_ERROR })
}

export const sendMethodNotAllowedError = res => {
   return res.status(STATUS_405_METHOD_NOT_ALLOWED).end()
}
