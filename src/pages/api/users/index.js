import Cors from "micro-cors"

import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { create, search } from "../../../services/users"
import sendWelcomeMail from "../../../services/users/send-mail"
import { checkIsAdmin, checkValidUserWithPrivilege } from "../../../utils/auth"
import { CORS_ALLOW_ORIGIN, METHOD_GET, METHOD_OPTIONS, METHOD_POST, STATUS_200_OK } from "../../../utils/http"
import { ADMIN } from "../../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    switch (req.method) {
      case METHOD_GET: {
        const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

        checkIsAdmin(currentUser)

        const { users, totalCount, currentPage, maxPage, byPage } = await search({ ...req.query, currentUser })

        return res.status(STATUS_200_OK).json({ totalCount, currentPage, maxPage, byPage, elements: users })
      }
      case METHOD_POST: {
        const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)

        checkIsAdmin(currentUser)

        const id = await create(req.body, currentUser)

        sendWelcomeMail(req.body.email)

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
