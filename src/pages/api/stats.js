import Cors from "micro-cors"
import moment from "moment"

import { version } from "../../../package.json"
import knex from "../../knex/knex"
import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { FORMAT_DATE } from "../../utils/date"
import { METHOD_GET, METHOD_OPTIONS, STATUS_200_OK } from "../../utils/http"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")

  try {
    switch (req.method) {
      case METHOD_GET: {
        const [globalCount] = await knex("acts").whereNull("deleted_at").count()

        const stats = await knex("acts")
          .joinRaw("inner join hospitals h on acts.hospital_id = h.id")
          .groupByRaw("h.id, h.name")
          .whereNull("acts.deleted_at")
          .select("h.id", "h.name")
          .count()

        const stats7days = await knex("acts")
          .joinRaw("inner join hospitals h on acts.hospital_id = h.id")
          .groupByRaw("h.id, h.name")
          .whereRaw("acts.deleted_at is null and acts.created_at > now() - interval '7 days'")
          .select("h.id", "h.name")
          .count()

        const [date] = await knex.select(knex.raw("now()"))

        const result = {
          buildVersion: version,
          currentDate: moment(date.now).format(FORMAT_DATE),
          nbActs: parseInt(globalCount?.count || 0, 10),
          nbETP: stats?.length || 0,
        }

        result.details = stats.reduce((acc, curr) => {
          acc[curr.id] = { name: curr.name, total: parseInt(curr.count, 10), last7days: 0 }
          return acc
        }, {})

        stats7days.forEach((elt) => {
          result.details[elt.id].last7days = parseInt(elt.count, 10)
        })

        return res.status(STATUS_200_OK).json(result)
      }
      default:
        if (req.method !== METHOD_OPTIONS) return sendMethodNotAllowedError(res)
    }
  } catch (error) {
    sendAPIError(error, res)
  }
}

const cors = Cors({
  allowMethods: [METHOD_GET, METHOD_OPTIONS],
})

export default cors(handler)
