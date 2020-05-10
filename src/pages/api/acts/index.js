import Cors from "micro-cors"
import * as yup from "yup"

import { STATUS_200_OK, METHOD_GET, METHOD_OPTIONS, METHOD_POST } from "../../../utils/http"
import { ACT_CONSULTATION, ACT_MANAGEMENT } from "../../../utils/roles"
import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"
import { create, search } from "../../../services/acts"
import { normalize } from "../../../services/normalize"

const searchSchema = yup.object().shape({
  startDate: yup.date(),
  endDate: yup.date(),
  hospitals: yup.array().of(yup.number().positive().integer()),
  profiles: yup.array(),
  asker: yup.string(),
  internalNumber: yup.string(),
  pvNumber: yup.string(),
  fuzzy: yup.string(),
  requestedPage: yup.number().integer().positive(),
  currentUser: yup.object(),
})

export const normalizeSearchInputs = normalize(searchSchema)

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")

  try {
    switch (req.method) {
      case METHOD_GET: {
        const currentUser = checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

        console.log("query xxx", req.query)

        // Wrap supposed array fields with array litteral syntax for yup try to cast
        req.query.hospitals = req.query.hospitals ? req.query.hospitals.split(",") : []
        req.query.profiles = req.query.profiles ? req.query.profiles.split(",") : []

        const params = await normalizeSearchInputs({ ...req.query, currentUser })

        console.log("params XXX", params)

        const { totalCount, currentPage: requestedPage, maxPage, byPage: LIMIT, elements: acts } = await search(params)

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
