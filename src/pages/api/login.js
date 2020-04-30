import Cors from "micro-cors"

import { STATUS_200_OK, METHOD_OPTIONS, METHOD_POST } from "../../utils/http"
import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { authenticate } from "../../services/authentication"
import { timeout } from "../../config"

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      switch (req.method) {
         case METHOD_POST: {
            const { email, password } = req.body
            const { user, token } = await authenticate(email, password)

            res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly; Max-Age=${timeout.cookie}`)

            return res.status(STATUS_200_OK).json(user)
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
