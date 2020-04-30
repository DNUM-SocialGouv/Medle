import Cors from "micro-cors"

import {
   STATUS_200_OK,
   STATUS_404_NOT_FOUND,
   METHOD_GET,
   METHOD_DELETE,
   METHOD_OPTIONS,
   METHOD_PUT,
} from "../../../utils/http"
import { ACT_CONSULTATION, ACT_MANAGEMENT } from "../../../utils/roles"
import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"

import { del, find, update } from "../../../services/acts"

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      switch (req.method) {
         case METHOD_GET: {
            const currentUser = checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

            const act = await find(req.query, currentUser)

            return act ? res.status(STATUS_200_OK).json(act) : res.status(STATUS_404_NOT_FOUND).end()
         }
         case METHOD_DELETE: {
            const currentUser = checkValidUserWithPrivilege(ACT_MANAGEMENT, req, res)

            const deleted = await del(req.query, currentUser)

            return res.status(STATUS_200_OK).json({ deleted })
         }
         case METHOD_PUT: {
            const currentUser = checkValidUserWithPrivilege(ACT_MANAGEMENT, req, res)

            const updated = await update(req.query, req.body, currentUser)

            return res.status(STATUS_200_OK).json({ updated })
         }
         default:
            if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
      }
   } catch (error) {
      sendAPIError(error, res)
   }
}

const cors = Cors({
   allowMethods: [METHOD_DELETE, METHOD_GET, METHOD_OPTIONS, METHOD_PUT],
})

export default cors(handler)
