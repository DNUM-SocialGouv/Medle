import Cors from "micro-cors"

import knex from "../../knex/knex"
import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { APIError } from "../../utils/errors"
import { checkIsSuperAdmin, checkValidUserWithPrivilege } from "../../utils/auth"
import { CORS_ALLOW_ORIGIN, METHOD_GET, METHOD_OPTIONS, METHOD_PUT, STATUS_200_OK, STATUS_400_BAD_REQUEST } from "../../utils/http"
import { ADMIN } from "../../utils/roles"
import { logAudit } from "../../utils/logger"

const { getUsersPurgeInactivityDays, updateUsersPurgeInactivityDays } = require("../../services/app-settings")

const getCurrentUser = (req, res) => {
  const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)
  checkIsSuperAdmin(currentUser)
  return currentUser
}

const validateUsersPurgeInactivityDays = (value) => {
  const usersPurgeInactivityDays = Number.parseInt(value, 10)

  if (!Number.isInteger(usersPurgeInactivityDays) || usersPurgeInactivityDays <= 0) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "La durée de non connexion doit être un nombre de jours strictement positif.",
    })
  }

  return usersPurgeInactivityDays
}

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    const currentUser = getCurrentUser(req, res)

    switch (req.method) {
      case METHOD_GET: {
        const usersPurgeInactivityDays = await getUsersPurgeInactivityDays(knex)

        return res.status(STATUS_200_OK).json({ usersPurgeInactivityDays })
      }
      case METHOD_PUT: {
        const usersPurgeInactivityDays = validateUsersPurgeInactivityDays(req.body.usersPurgeInactivityDays)
        const updatedUsersPurgeInactivityDays = await updateUsersPurgeInactivityDays(knex, usersPurgeInactivityDays)

        logAudit(`${currentUser.email}: Mise à jour du délai de purge des utilisateurs à ${updatedUsersPurgeInactivityDays} jours`)

        return res.status(STATUS_200_OK).json({ usersPurgeInactivityDays: updatedUsersPurgeInactivityDays })
      }
      default:
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    sendAPIError(error, res)
  }
}

const cors = Cors({
  allowMethods: [METHOD_GET, METHOD_OPTIONS, METHOD_PUT],
})

export default cors(handler)