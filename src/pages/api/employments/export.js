import Cors from "micro-cors"

import { exportEmployments } from "../../../services/employments"
import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"
import { METHOD_GET, METHOD_OPTIONS, STATUS_200_OK } from "../../../utils/http"
import { logDebug } from "../../../utils/logger"
import { EMPLOYMENT_CONSULTATION } from "../../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  const { hospitals, year } = req.query

  try {
    switch (req.method) {
      case METHOD_GET: {
        const currentUser = checkValidUserWithPrivilege(EMPLOYMENT_CONSULTATION, req, res)

        const workbook = await exportEmployments({ hospitals, year }, currentUser)

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx")

        await workbook.xlsx.write(res)

        logDebug("Export fichier XLSX")

        return res.status(STATUS_200_OK).end()
      }
      default:
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    sendAPIError(error, res)
  }
}

const cors = Cors({
  allowMethods: [METHOD_GET, METHOD_OPTIONS, METHOD_GET],
})

export default cors(handler)
