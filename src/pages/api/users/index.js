import Cors from "micro-cors"

import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { create, search } from "../../../services/users"
import { checkIsSuperAdmin, checkValidUserWithPrivilege } from "../../../utils/auth"
import { METHOD_GET, METHOD_OPTIONS, METHOD_POST, STATUS_200_OK } from "../../../utils/http"
import { ADMIN } from "../../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")

  try {
    switch (req.method) {
      case METHOD_GET: {
        const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

        checkIsSuperAdmin(currentUser)

        const { users, totalCount, currentPage, maxPage, byPage } = await search({ ...req.query, currentUser })

        return res.status(STATUS_200_OK).json({ totalCount, currentPage, maxPage, byPage, elements: users })
      }
      case METHOD_POST: {
        const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

        checkIsSuperAdmin(currentUser)

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
