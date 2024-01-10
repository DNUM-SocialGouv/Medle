import Cors from "micro-cors"

import { sendAPIError, sendForbiddenError, sendMethodNotAllowedError } from "../../../services/errorHelpers"
import { checkValidUserWithPrivilege } from "../../../utils/auth"
import { CORS_ALLOW_ORIGIN, METHOD_GET, METHOD_OPTIONS, METHOD_POST, STATUS_200_OK } from "../../../utils/http"
import { logDebug } from "../../../utils/logger"
import { ACTIVITY_CONSULTATION } from "../../../utils/roles"
import { isAllowedHospitals } from "../../../utils/scope"
import { exportSummary } from "../../../services/acts-summary/export"
import { findHospital } from "../../../clients/hospitals"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  const { hospitals } = req.query

  try {
    switch (req.method) {
      case METHOD_GET: {
        const currentUser = checkValidUserWithPrivilege(ACTIVITY_CONSULTATION, req, res)

        if (hospitals && !isAllowedHospitals(currentUser, [hospitals])) return sendForbiddenError(res)

        const workbook = await exportSummary(req.query, currentUser, req.headers)
        const hospital = await findHospital({ id: hospitals, headers: req.headers })

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.setHeader("Content-Disposition", "attachment; filename=" + "Synthèse de l'établissement " + hospital.name + ".xlsx")

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
