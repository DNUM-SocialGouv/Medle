import Cors from "micro-cors"

import { sendMethodNotAllowedError } from "../../services/errorHelpers"
import { METHOD_GET, METHOD_OPTIONS, STATUS_200_OK } from "../../utils/http"

const handler = async (req, res) => {
  switch (req.method) {
    case METHOD_GET:
      res.setHeader("Set-Cookie", `token=; Path=/; HttpOnly; Max-Age=10`) // 2 heures max. TODO: mettre en confi (cf. expiration JWT)
      return res.status(STATUS_200_OK).end()

    default:
      if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
  }
}

const cors = Cors({
  allowMethods: [METHOD_OPTIONS, METHOD_GET],
})

export default cors(handler)
