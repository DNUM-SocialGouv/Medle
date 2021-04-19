import Cors from "micro-cors"

import { sendMail } from "../../services/email"
import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { findByEmail } from "../../services/users/find"
import {
  METHOD_OPTIONS,
  METHOD_POST,
  STATUS_200_OK,
  STATUS_404_NOT_FOUND,
  STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../utils/http"
import { generateToken } from "../../utils/jwt"

const APP_URL = process.env.APP_BASE_URL || "http://localhost:3000"

function buildHtml({ token }) {
  const html = `
    Bonjour 👋,

    <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>

    <p>Modifiez-le en cliquant sur ce lien (valide pendant 1 heure) :</p>

    <p><a href="${APP_URL}/reset-password?loginToken=${token}">${APP_URL}/reset-password?loginToken=${token}</a></p>

    <p>Si le lien de réinitialisation ne s’affiche pas, copiez et collez-le dans votre navigateur.</p>

    <p>Si votre lien de réinitialisation a expiré, demandez-en un nouveau.</p>

    <p>Si vous ne souhaitez pas réinitialiser votre mot de passe, vous pouvez ignorer cet e-mail.</p>

    <p>A bientôt sur Medlé 🚀,</p>

    <p>Des questions sur Medlé? La réponse se trouve peut-être dans la <a href="${APP_URL}/faq">FAQ</a> 🤞.</p>
    `

  return html
}

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  const to = req?.body.email
  try {
    switch (req.method) {
      case METHOD_POST: {
        try {
          const user = await findByEmail(to)

          if (!user) {
            return res.status(STATUS_404_NOT_FOUND).json({
              message: `User with email ${to} doesn't exist.`,
              status: STATUS_404_NOT_FOUND,
            })
          }

          const token = generateToken(user, { timeout: "1H" })

          const info = await sendMail({
            html: buildHtml({ token }),
            subject: "Demande de réinitialisation de mot de passe Medlé",
            to,
          })

          console.debug(info)
          return res.status(STATUS_200_OK).json({})
        } catch (error) {
          console.error("SEND_VERIFICATION_EMAIL_ERROR", to, error)
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
    sendAPIError(error, res)
  }
}

const cors = Cors({
  allowMethods: [METHOD_POST, METHOD_OPTIONS],
})

export default cors(handler)
