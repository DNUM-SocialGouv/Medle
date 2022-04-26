import busboy from "busboy"
import fs from "fs"
import Cors from "micro-cors"

import knex from "../../knex/knex"
import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { checkIsSuperAdmin, checkValidUserWithPrivilege } from "../../utils/auth"
import { ISO_TIME, now } from "../../utils/date"
import { APIError } from "../../utils/errors"
import {
  CORS_ALLOW_ORIGIN,
  METHOD_GET,
  METHOD_OPTIONS,
  METHOD_POST,
  STATUS_200_OK,
  STATUS_404_NOT_FOUND,
} from "../../utils/http"
import { ADMIN } from "../../utils/roles"

const ADMIN_METHODS = [METHOD_POST]

const DOCUMENTS_FS_PATH = process.env.DOCUMENTS_FS_PATH || "./documents"
const PATH_LOGOS = DOCUMENTS_FS_PATH + "/logos"

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
}

const handler = async (req, res) => {
  if (requireAdminAccess(req)) {
    checkAdminAccess(req, res)
  }
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  try {
    switch (req.method) {
      case METHOD_GET: {
        const [logo] = await knex("documents")
          .where("type", "logo-ministere")
          .select("documents.id", "documents.name", "documents.size", "documents.type_mime", "documents.type")

        if (!logo) {
          throw new APIError({
            status: STATUS_404_NOT_FOUND,
            message: "Not found",
          })
        }
        try {
          const content = fs.readFileSync(PATH_LOGOS + "/" + logo.name)
          res.setHeader("Content-Type", logo.type_mime)
          return res.status(STATUS_200_OK).send(content)
        } catch (err) {
          throw new APIError({
            status: STATUS_404_NOT_FOUND,
            message: "Not found",
          })
        }
      }
      case METHOD_POST: {
        const bb = busboy({ headers: req.headers })

        let filename, mimeType, filedata

        bb.on("file", (name, file, info) => {
          filename = info.filename
          mimeType = info.mimeType

          file.on("data", (data) => {
            filedata = data
          })
        })
        req.pipe(bb)

        const [isLogoPresent] = await knex("documents").where("type", "logo-ministere").count()

        if (isLogoPresent.count < 1) {
          await knex("documents").insert({
            type: "logo-ministere",
            name: filename,
            type_mime: mimeType,
            size: filedata.length,
          })
        } else {
          await knex("documents")
            .update({
              name: filename,
              type_mime: mimeType,
              size: filedata.length,
              updated_at: now().format(ISO_TIME),
            })
            .where("type", "logo-ministere")
        }

        fs.rm(PATH_LOGOS, { recursive: true, force: true }, (errDelDir) => {
          if (errDelDir) throw errDelDir
          fs.mkdir(PATH_LOGOS, { recursive: true }, (errDir) => {
            if (errDir) throw errDir
            fs.writeFile(PATH_LOGOS + "/" + filename, filedata, function (errFile) {
              if (errFile) throw errFile
            })
          })
        })

        res.setHeader("Content-Type", "application/json")
        return res.status(STATUS_200_OK).json({})
      }
      default:
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    sendAPIError(error, res)
  }
}

const cors = Cors({
  allowMethods: [METHOD_OPTIONS, METHOD_GET, METHOD_POST],
})

export default cors(handler)
