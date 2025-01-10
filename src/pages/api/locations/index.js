import Cors from "micro-cors"

import { find } from "../../../services/locations"
import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"
import { APIError } from "../../../utils/errors"
import {
  CORS_ALLOW_ORIGIN,
  METHOD_GET,
  METHOD_OPTIONS,
  STATUS_200_OK,
  STATUS_404_NOT_FOUND,
} from "../../../utils/http"
import { ACT_CONSULTATION } from "../../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    switch (req.method) {
      case METHOD_GET: {
        checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

        const locations = await find()

        if (!locations) {
          throw new APIError({
            status: STATUS_404_NOT_FOUND,
            message: "Not found",
          })
        }

        return res.status(STATUS_200_OK).json(locations)
      }
      default:
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    sendAPIError(error, res)
  }
}

const cors = Cors({
  allowMethods: [METHOD_GET, METHOD_OPTIONS],
})

export default cors(handler)
