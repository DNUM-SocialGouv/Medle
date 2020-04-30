import Cors from "micro-cors"

import { STATUS_200_OK, METHOD_GET, METHOD_OPTIONS, METHOD_POST } from "../../../../utils/http"
import { sendAPIError, sendMethodNotAllowedError } from "../../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../../utils/auth"
import { ADMIN } from "../../../../utils/roles"

import { search, create } from "../../../../services/users"

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      switch (req.method) {
         case METHOD_GET: {
            const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

            const { users, totalCount, currentPage, maxPage, byPage } = await search({ ...req.query, currentUser })

            return res.status(STATUS_200_OK).json({ totalCount, currentPage, maxPage, byPage, elements: users })
         }
         case METHOD_POST: {
            const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

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
