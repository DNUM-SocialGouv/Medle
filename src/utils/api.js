import {
   STATUS_401_UNAUTHORIZED,
   STATUS_403_FORBIDDEN,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "./http"
import { isAllowed, NO_PRIVILEGE_REQUIRED } from "./roles"
import { checkToken, decodeToken } from "./jwt"
import { APIError } from "./errors"

export const sendAPIError = (error, res) => {
   if (error instanceof APIError) {
      return res.status(error.status).json(error)
   } else {
      // fallback error
      return res
         .status(STATUS_500_INTERNAL_SERVER_ERROR)
         .json({ message: `Erreur de base de donnée / ${error}`, status: STATUS_500_INTERNAL_SERVER_ERROR })
   }
}

export const checkValidUserWithPrivilege = (privilege, req) => {
   const { token } = req.cookies

   console.log("cookies xxx", req.cookies)

   try {
      if (!token) {
         throw new APIError({
            message: "Non authentified user",
            detailMessage: "toto",
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

export const checkHttpMethod = (methods, req) => {
   if (!methods || !methods.length) {
      console.error("Incorrect call of checkHttpMethod")
      return
   }

   if (!methods.includes(req.method)) {
      throw new APIError({ message: "Method not allowed", status: STATUS_405_METHOD_NOT_ALLOWED })
   }
}
