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
  STATUS_400_BAD_REQUEST,
} from "../../utils/http"
import { ADMIN } from "../../utils/roles"

const ADMIN_METHODS = [METHOD_POST]

const DOCUMENTS_FS_PATH = process.env.DOCUMENTS_FS_PATH || "./documents"
const PATH_FOOTER_LINKS = DOCUMENTS_FS_PATH + "/footer-documents"

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
        const footerLinks = await knex("documents").select("*").where("type", "ilike", "footer-document-%")

        return res.status(STATUS_200_OK).json(footerLinks)
      }
      case METHOD_POST: {
        const bb = busboy({ headers: req.headers })

        const type = req.query.type

        if (!type) {
          throw new APIError({
            status: STATUS_400_BAD_REQUEST,
            message: "Bad request",
          })
        }

        let filename, mimeType, filedata

        bb.on("file", (name, file, info) => {
          filename = info.filename
          mimeType = info.mimeType

          file.on("data", (data) => {
            filedata = data
          })
        })
        req.pipe(bb)

        const [isDocumentPresent] = await knex("documents").where("type", type).count()

        if (isDocumentPresent.count < 1) {
          await knex("documents").insert({
            type: type,
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
            .where("type", type)
        }

        fs.rm(PATH_FOOTER_LINKS, { recursive: true, force: true }, (errDelDir) => {
          if (errDelDir) throw errDelDir
          fs.mkdir(PATH_FOOTER_LINKS, { recursive: true }, (errDir) => {
            if (errDir) throw errDir
            fs.writeFile(PATH_FOOTER_LINKS + "/" + filename, filedata, function (errFile) {
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
