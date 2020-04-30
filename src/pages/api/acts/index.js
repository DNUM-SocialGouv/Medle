import Cors from "micro-cors"

import { STATUS_200_OK, METHOD_GET, METHOD_OPTIONS, METHOD_POST } from "../../../utils/http"
import { ACT_CONSULTATION, ACT_MANAGEMENT } from "../../../utils/roles"
import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"

import { create, search } from "../../../services/acts"

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      switch (req.method) {
         case METHOD_GET: {
            const currentUser = checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

            const { totalCount, currentPage: requestedPage, maxPage, byPage: LIMIT, elements: acts } = await search(
               req.query,
               currentUser,
            )

            return res
               .status(STATUS_200_OK)
               .json({ totalCount, currentPage: requestedPage, maxPage, byPage: LIMIT, elements: acts })
         }
         case METHOD_POST: {
            const currentUser = checkValidUserWithPrivilege(ACT_MANAGEMENT, req, res)

            const id = await create(req.body, currentUser)

            return res.status(STATUS_200_OK).json({ id })
         }
         default:
            if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
      }
   } catch (error) {
      sendAPIError(error, res)
   }
}

const cors = Cors({
   allowMethods: [METHOD_GET, METHOD_OPTIONS, METHOD_POST],
})

export default cors(handler)
