import Cors from "micro-cors"

import { STATUS_200_OK, METHOD_GET, METHOD_OPTIONS, METHOD_POST } from "../../../utils/http"
import { ADMIN, NO_PRIVILEGE_REQUIRED } from "../../../utils/roles"
import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"
import { create, search } from "../../../services/hospitals"

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      switch (req.method) {
         case METHOD_GET: {
            checkValidUserWithPrivilege(NO_PRIVILEGE_REQUIRED, req, res)

            const hospitals = await search(req.query)

            return res.status(STATUS_200_OK).json(hospitals)
         }
         case METHOD_POST: {
            checkValidUserWithPrivilege(ADMIN, req, res)

            const id = await create(req.body)

            return res.status(STATUS_200_OK).json({ id })
         }
         default:
            return sendMethodNotAllowedError(res)
      }
   } catch (error) {
      sendAPIError(error, res)
   }
}

const cors = Cors({
   allowMethods: [METHOD_GET, METHOD_OPTIONS],
})

export default cors(handler)
