import Cors from "micro-cors"
import multer from "multer";

import knex from "../../knex/knex"
import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { checkIsSuperAdmin, checkValidUserWithPrivilege } from "../../utils/auth"
import { METHOD_GET, METHOD_OPTIONS, METHOD_PUT, STATUS_200_OK, CORS_ALLOW_ORIGIN } from "../../utils/http"
import { ADMIN } from "../../utils/roles"

const ADMIN_METHODS = [METHOD_PUT]

const requireAdminAccess = (req) => {
  return req.query.queryAll !== undefined || ADMIN_METHODS.includes(req.method)
}

const checkAdminAccess = (req, res) => {
  const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)
  checkIsSuperAdmin(currentUser)
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (requireAdminAccess(req)) {
    checkAdminAccess(req, res)
  }
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    switch (req.method) {
      case METHOD_GET: {
        const logo = await knex("documents")
          .where("type", "logo")
          .select("*")

        return res.status(STATUS_200_OK).json(logo)
      }
      case METHOD_PUT: {
        // TODO: creer filesystem
        console.debug(req.file)
        console.debug(req.body)

        const [isLogoPresent] = await knex("documents").where("type", "logo").count();

        if (isLogoPresent.count < 1) {
          const {newId} = await knex("documents").insert(
            {
              type: "logo",
              name: "logo_ministere",
              type_mime: req.body.type,
              size: req.body.size,
            },
          )
          return res.status(STATUS_200_OK).json({
            id: newId,
          })
        } else {
          const {newId} = await knex("documents").update(
            {
              type_mime: req.body.type,
              size: req.body.size,
            },
          ).where("type", "logo")
          return res.status(STATUS_200_OK).json({
            id: newId,
          })
        }
        
      }
      default:
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    sendAPIError(error, res)
  }
}

const cors = Cors({
  allowMethods: [METHOD_OPTIONS, METHOD_GET, METHOD_PUT],
})

export default cors(handler)
