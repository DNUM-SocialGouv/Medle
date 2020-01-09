import { STATUS_401_UNAUTHORIZED, STATUS_405_METHOD_NOT_ALLOWED } from "./http"
import { isAllowed } from "./roles"
import { checkToken, decodeToken } from "./jwt"

export const checkValidUserWithPrivilege = (privilege, req, res) => {
   const { token } = req.cookies

   if (!token) {
      console.error(`Non authentified user ${STATUS_401_UNAUTHORIZED}`)
      return res.status(STATUS_401_UNAUTHORIZED).json({ message: "Non authentified user" })
   }

   let currentUser

   try {
      currentUser = checkToken(token)
   } catch (error) {
      let email
      try {
         // Let's try to get user informations even if the token is not valid
         const currentUser = decodeToken(token)
         email = currentUser.email
      } catch (error) {
         console.error("Token couldn't been decoded")
      }
      console.error(`Invalid token ${STATUS_401_UNAUTHORIZED} (${email ? email : "unknown user"})`, error)
      return res.status(STATUS_401_UNAUTHORIZED).json({ message: "Invalid token" })
   }

   if (!isAllowed(currentUser.role, privilege)) {
      console.error(
         `Not allowed role ${STATUS_401_UNAUTHORIZED}  (${currentUser.email ? currentUser.email : "unknown user"})`,
      )
      return res.status(STATUS_401_UNAUTHORIZED).json({ message: "Not allowed role" })
   }
}

export const checkHttpMethod = (methods, req, res) => {
   if (!methods || !methods.length) {
      console.error("Incorrect call of checkHttpMethod")
      return
   }

   if (!methods.includes(req.method)) {
      console.error(`Method not allowed ${STATUS_405_METHOD_NOT_ALLOWED}`)
      return res.status(STATUS_405_METHOD_NOT_ALLOWED).json({ message: "Method not allowed" })
   }
}
