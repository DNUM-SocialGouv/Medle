import Cors from "micro-cors"

import { create, search } from "../../../services/acts"
import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"
import { METHOD_GET, METHOD_OPTIONS, METHOD_POST, STATUS_200_OK, CORS_ALLOW_ORIGIN } from "../../../utils/http"
import { ACT_CONSULTATION, ACT_MANAGEMENT } from "../../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    switch (req.method) {
      case METHOD_GET: {
        const currentUser = checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

        const { totalCount, currentPage: requestedPage, maxPage, byPage: LIMIT, elements: acts } = await search(
          req.query,
          currentUser
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
