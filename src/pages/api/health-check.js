import Cors from "micro-cors"

import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { CORS_ALLOW_ORIGIN, METHOD_GET, METHOD_OPTIONS, STATUS_200_OK } from "../../utils/http"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    switch (req.method) {
      case METHOD_GET: {
        return res.status(STATUS_200_OK).json({ message: 'ok' })
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
