import Cors from "micro-cors"

import { STATUS_200_OK, METHOD_GET, METHOD_DELETE, METHOD_PUT, METHOD_OPTIONS } from "../../../../utils/http"
import { sendAPIError, sendMethodNotAllowedError, sendNotFoundError } from "../../../../services/errorHelpers"
import { ADMIN } from "../../../../utils/roles"
import { checkValidUserWithPrivilege } from "../../../../utils/auth"

import { find, del, update } from "../../../../services/users"

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      switch (req.method) {
         case METHOD_GET: {
            const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

            const user = await find({ ...req.query, currentUser })

            if (!user) return sendNotFoundError(res)

            return res.status(STATUS_200_OK).json(user)
         }
         case METHOD_DELETE: {
            const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

            const deleted = await del({ ...req.query, currentUser })

            if (!deleted) return sendNotFoundError(res)

            return res.status(STATUS_200_OK).json({ deleted })
         }
         case METHOD_PUT: {
            const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

            const updated = await update(req.query, req.body, currentUser)

            if (!updated) return sendNotFoundError(res)

            return res.status(STATUS_200_OK).json({ updated })
         }
         default:
            if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
      }
   } catch (error) {
      return sendAPIError(error, res)
   }
}

const cors = Cors({
   allowMethods: [METHOD_DELETE, METHOD_GET, METHOD_OPTIONS, METHOD_PUT],
})

export default cors(handler)
