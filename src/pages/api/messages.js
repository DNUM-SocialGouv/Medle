import Cors from "micro-cors"

import knex from "../../knex/knex"
import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { checkIsSuperAdmin, checkValidUserWithPrivilege } from "../../utils/auth"
import { ISO_DATE, now } from "../../utils/date"
import { METHOD_DELETE, METHOD_GET, METHOD_OPTIONS, METHOD_POST, STATUS_200_OK, CORS_ALLOW_ORIGIN } from "../../utils/http"
import { ADMIN } from "../../utils/roles"

const ADMIN_METHODS = [METHOD_DELETE, METHOD_POST]

const requireAdminAccess = (req) => {
  return req.query.queryAll !== undefined || ADMIN_METHODS.includes(req.method)
}

const checkAdminAccess = (req, res) => {
  const currentUser = checkValidUserWithPrivilege(ADMIN, req, res)
  checkIsSuperAdmin(currentUser)
}

const handler = async (req, res) => {
  if (requireAdminAccess(req)) {
    checkAdminAccess(req, res)
  }
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", CORS_ALLOW_ORIGIN)
  res.setHeader("Access-Control-Allow-Credentials", "false")

  const today = now().format(ISO_DATE)
  const { queryAll } = req.query

  try {
    switch (req.method) {
      case METHOD_GET: {
        const messages = await knex("messages")
          .orderBy([
            { column: "start_date", order: "desc" },
            { column: "id", order: "desc" },
          ])
          .modify((queryBuilder) => {
            if (!queryAll) {
              queryBuilder
                .whereRaw(`start_date <= to_date(?, '${ISO_DATE}')`, today)
                .whereRaw(`(end_date >= to_date(?, '${ISO_DATE}') or end_date is null)`, today)
            }
          })
          .select("*")

        return res.status(STATUS_200_OK).json(messages)
      }
      case METHOD_DELETE: {
        const [deletedId] = await knex("messages").where("id", req.query.id).delete("id")
        return res.status(STATUS_200_OK).send({
          id: deletedId,
        })
      }
      case METHOD_POST: {
        const [newId] = await knex("messages").insert(
          {
            start_date: req.body.start_date || null,
            end_date: req.body.end_date || null,
            content: req.body.content,
          },
          "id"
        )
        return res.status(STATUS_200_OK).json({
          id: newId,
        })
      }
      default:
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    sendAPIError(error, res)
  }
}

const cors = Cors({
  allowMethods: [METHOD_OPTIONS, METHOD_GET],
})

export default cors(handler)
