import Cors from "micro-cors"

import { exportActs } from "../../../services/acts"
import { sendAPIError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"
import { METHOD_GET, METHOD_OPTIONS, METHOD_POST, STATUS_200_OK } from "../../../utils/http"
import { logDebug } from "../../../utils/logger"
import { ACT_CONSULTATION } from "../../../utils/roles"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")

  try {
    switch (req.method) {
      case METHOD_GET: {
        const currentUser = checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

        const workbook = await exportActs(req.query, currentUser)

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
  allowMethods: [METHOD_GET, METHOD_OPTIONS, METHOD_POST],
})

export default cors(handler)
