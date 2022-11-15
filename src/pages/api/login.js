import Cors from "micro-cors"

import { timeoutConfig } from "../../config"
import { authenticate } from "../../services/authentication"
import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { CORS_ALLOW_ORIGIN, METHOD_OPTIONS, METHOD_POST, STATUS_200_OK } from "../../utils/http"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    switch (req.method) {
      case METHOD_POST: {
        const { email, password } = req.body
        const { user, token } = await authenticate(email, password)

        res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly; Max-Age=${timeoutConfig.cookie}`)

        return res.status(STATUS_200_OK).json(JSON.stringify({ user, token }))
      }
      default:
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    return sendAPIError(error, res)
  }
}
const cors = Cors({
  allowMethods: [METHOD_OPTIONS, METHOD_POST],
})

export default cors(handler)
