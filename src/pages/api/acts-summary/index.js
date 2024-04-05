import Cors from "micro-cors"

import { search } from "../../../services/acts-summary/search"
import { sendAPIError, sendForbiddenError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"
import { CORS_ALLOW_ORIGIN, METHOD_GET, METHOD_OPTIONS, METHOD_POST, STATUS_200_OK } from "../../../utils/http"
import { ACTIVITY_CONSULTATION } from "../../../utils/roles"
import { isAllowedHospitals } from "../../../utils/scope"
import { find } from "../../../services/hospitals"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  const { hospitals } = req.query

  try {
    switch (req.method) {
      case METHOD_GET: {
        const currentUser = checkValidUserWithPrivilege(ACTIVITY_CONSULTATION, req, res)

        if (hospitals && !isAllowedHospitals(currentUser, [Number(hospitals)])) return sendForbiddenError(res)

        const hospital = await find({ hid: hospitals })

        const {
          totalCount,
          currentPage: requestedPage,
          maxPage,
          byPage: LIMIT,
          elements: summaries,
        } = await search(req.query, currentUser)

        return res
          .status(STATUS_200_OK)
          .json({ totalCount, currentPage: requestedPage, maxPage, byPage: LIMIT, elements: summaries, hospital })
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
