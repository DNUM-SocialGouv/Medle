import knex from "../../knex/knex"
import { STATUS_200_OK } from "../../utils/http"
import { sendAPIError } from "../../utils/api"
import moment from "moment"

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // SQL query
      const [globalCount] = await knex("acts")
         .whereNull("deleted_at")
         .count()

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

      const result = { currentDate: moment(date.now).format("DD/MM/YYYY"), globalCount: parseInt(globalCount.count) }

      result.acts = stats.reduce((acc, curr) => {
         acc[curr.id] = { name: curr.name, total: parseInt(curr.count, 10), last7days: 0 }
         return acc
      }, {})

      stats7days.forEach(elt => {
         result.acts[elt.id].last7days = parseInt(elt.count, 10)
      })

      return res.status(STATUS_200_OK).json(result)
   } catch (error) {
      // DB error
      sendAPIError(error, res)
   }
}
