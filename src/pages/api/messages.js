import Cors from "micro-cors"
import { STATUS_200_OK, METHOD_GET, METHOD_OPTIONS } from "../../utils/http"
import knex from "../../knex/knex"
import { sendAPIError, sendMethodNotAllowedError } from "../../services/errorHelpers"
import { ISO_DATE, now } from "../../utils/date"

const handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json")

  const today = now().format(ISO_DATE)

  try {
    switch (req.method) {
      case METHOD_GET: {
        const messages = await knex("messages")
          .orderBy([
            { column: "start_date", order: "desc" },
            { column: "id", order: "desc" },
          ])
          .whereRaw(`start_date <= to_date(?, '${ISO_DATE}')`, today)
          .whereRaw(`(end_date >= to_date(?, '${ISO_DATE}') or end_date is null)`, today)
          .select("*")

        return res.status(STATUS_200_OK).json(messages)
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
