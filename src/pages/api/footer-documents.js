import formidable from "formidable"
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
  STATUS_404_NOT_FOUND,
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
        const type = req.query.type

        if (!type) {
          throw new APIError({
            status: STATUS_400_BAD_REQUEST,
            message: "Bad request",
          })
        }

        const [footerDocument] = await knex("documents").select("*").where("type", type)

        if (!footerDocument) {
          throw new APIError({
            status: STATUS_404_NOT_FOUND,
            message: "Not found",
          })
        }
        try {
          const content = fs.readFileSync(PATH_FOOTER_LINKS + "/" + type + "/" + footerDocument.name)
          res.setHeader("Content-Type", footerDocument.type_mime)
          return res.status(STATUS_200_OK).send(content)
        } catch (err) {
          throw new APIError({
            status: STATUS_404_NOT_FOUND,
            message: "Not found",
          })
        }
      }
      case METHOD_POST: {

        const type = req.query.type

        const form = new formidable.IncomingForm();
        const uploadFolder = PATH_FOOTER_LINKS;
        form.maxFileSize = 50 * 1024 * 1024; // 5MB
        form.uploadDir = uploadFolder + "/" + type;

        if (!type) {
          throw new APIError({
            status: STATUS_400_BAD_REQUEST,
            message: "Bad request",
          })
        }

        await fs.rmdirSync(PATH_FOOTER_LINKS + "/" + type, { recursive: true });
        await fs.mkdirSync(PATH_FOOTER_LINKS + "/" + type);

        form.on('file', function(field, file) {
              fs.rename(file.filepath, form.uploadDir + "/" + file.originalFilename, function( error ) {});
        });

        form.parse(req, async (err, fields, files) => {
          if (err) {
            throw new APIError({
              status: STATUS_400_BAD_REQUEST,
              message: "Error while parsing file",
            })
          }

          const [isDocumentPresent] = await knex("documents").where("type", type).count()

          if (isDocumentPresent.count < 1) {
            await knex("documents").insert({
              type: type,
              name: files.file.originalFilename,
              type_mime: files.file.mimetype,
              size: files.file.size,
            })
          } else {
            await knex("documents")
              .update({
                name: files.file.originalFilename,
                type_mime: files.file.mimetype,
                size: files.file.size,
                updated_at: now().format(ISO_TIME),
              })
              .where("type", type)
          }
        });

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
