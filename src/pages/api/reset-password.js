import Cors from "micro-cors"

import { sendMail } from "../../services/email"
import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { findById } from "../../services/users/find"
import { resetFromEmail, resetFromId } from "../../services/users/reset-password"
import { checkValidUserWithPrivilege } from "../../utils/auth"
import { METHOD_OPTIONS, METHOD_PATCH, METHOD_POST, STATUS_200_OK, STATUS_404_NOT_FOUND, STATUS_500_INTERNAL_SERVER_ERROR, CORS_ALLOW_ORIGIN } from "../../utils/http"
import { checkToken, generateToken } from "../../utils/jwt"
import { logDebug } from "../../utils/logger"
import { ADMIN } from "../../utils/roles"

const APP_URL = process.env.APP_BASE_URL || "http://localhost:3000"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    switch (req.method) {
      case METHOD_PATCH: {
        const { id, password, loginToken } = req.body
        let modified

        // Usage by inputs id/password for admin.
        if (id) {
          const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)
          logDebug("Password reset by user ", currentUser)

          modified = await resetFromId({ id, password })
        } else {
          // Usage by inputs loginToken/password for user which wants to change its own password.
          const user = checkToken(loginToken)

          modified = await resetFromEmail({ email: user.email, password })
        }
        console.debug("Nb user modified " + modified)

        return res.status(STATUS_200_OK).json({})
      }
      case METHOD_POST: {
        checkValidUserWithPrivilege(ADMIN, req, res)
        
        const { id } = req?.body.id
        console.debug(id)

        try {
          const user = await findById(id)

          if (!user) {
            return res.status(STATUS_404_NOT_FOUND).json({
              message: `User with id ${id} doesn't exist.`,
              status: STATUS_404_NOT_FOUND,
            })
          }

          const token = generateToken(user, { timeout: "1H" })

          const info = await sendMail({
            html: buildHtml({ token }),
            subject: "Demande de réinitialisation de mot de passe Medlé",
            to: user.email,
          })

          console.debug(info)
          return res.status(STATUS_200_OK).json({})
        } catch (error) {
          console.error("SEND_VERIFICATION_EMAIL_ERROR", id, error)
          return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
            detail: error.detail,
            message: error.message,
            status: STATUS_500_INTERNAL_SERVER_ERROR,
          })
        }
      }
      default:
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    return sendAPIError(error, res)
  }
}

function buildHtml({ token }) {
  const html = `
    Bonjour,

    <p>Nous avons reçu une demande de réinitialisation de mot de passe de l'administrateur pour votre compte.</p>

    <p>Modifiez-le en cliquant sur ce lien (valide pendant 1 heure) :</p>

    <p><a href="${APP_URL}/reset-password?loginToken=${token}">${APP_URL}/reset-password?loginToken=${token}</a></p>

    <p>Si le lien de réinitialisation ne s'affiche pas, copiez et collez-le dans votre navigateur.</p>

    <p>Si votre lien de réinitialisation a expiré, demandez-en un nouveau.</p>

    <p>A bientôt sur Medlé,</p>

    <p>Des questions sur Medlé? La réponse se trouve peut-être dans la <a href="${APP_URL}/faq">foire aux questions</a>.</p>
    `

  return html
}

const cors = Cors({
  allowMethods: [METHOD_OPTIONS, METHOD_PATCH, METHOD_POST],
})

export default cors(handler)
