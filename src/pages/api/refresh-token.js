import Cors from "micro-cors"
import moment from "moment"

import { timeoutConfig } from "../../config"
import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../utils/auth"
import { APIError } from "../../utils/errors"
import { CORS_ALLOW_ORIGIN, METHOD_GET, METHOD_OPTIONS, STATUS_200_OK, STATUS_401_UNAUTHORIZED } from "../../utils/http"
import { generateToken } from "../../utils/jwt"
import { NO_PRIVILEGE_REQUIRED } from "../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    switch (req.method) {
      case METHOD_GET: {
        let { token } = req.cookies
        const user = checkValidUserWithPrivilege(NO_PRIVILEGE_REQUIRED, req, res)

        // Le token a expiré OU ne peut plus être renouvelé
        if (
          (user.authStartedAt && moment(user.authStartedAt).add(timeoutConfig.session) < moment()) ||
          moment(user.authMaxDuration) < moment()
        ) {
          throw new APIError({
            status: STATUS_401_UNAUTHORIZED,
            message: "Token have expired",
          })
        } else {
          // Sinon on actualise le token avec les horodatages mis à jour
          user.authRefreshStart = moment().add(timeoutConfig.authRefreshStart) // Décalage du prochain déclenchement
          user.authMaxDuration = moment(user.authMaxDuration) // Reprise de la valeur existante pour la durée maximale

          // On retire les informations du précédent token stockées dans l'user
          delete user.iat
          delete user.exp

          // Génération d'un nouveau token avec une expiration de token repoussée
          token = generateToken(user)
          res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly; Max-Age=${timeoutConfig.cookie}`)

          return res.status(STATUS_200_OK).json({ user, token })
        }
      }
      default:
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    return sendAPIError(error, res)
  }
}
const cors = Cors({
  allowMethods: [METHOD_OPTIONS, METHOD_GET],
})

export default cors(handler)
