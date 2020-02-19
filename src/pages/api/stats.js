import knex from "../../knex/knex"
import { STATUS_200_OK } from "../../utils/http"
import { sendAPIError } from "../../utils/api"

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // SQL query
      const stats = await knex("acts")
         .joinRaw("inner join hospitals h on acts.hospital_id = h.id")
         .groupByRaw("h.id, h.name")
         .select("h.id", "h.name")
         .count()

      const stats7days = await knex("acts")
         .joinRaw("inner join hospitals h on acts.hospital_id = h.id")
         .groupByRaw("h.id, h.name")
         .whereRaw("acts.created_at > now() - interval '7 days'")
         .select("h.id", "h.name")
         .count()

      const date = await knex.select(knex.raw("now()")).first()

      const result = { currentDate: date.now }

      result.acts = stats.reduce((acc, curr) => {
         acc[curr.id] = { name: curr.name, total: curr.count }
         return acc
      }, {})

      stats7days.forEach(elt => {
         result.acts[elt.id].last7days = elt.count
      })

      return res.status(STATUS_200_OK).json(result)
   } catch (error) {
      // DB error
      sendAPIError(error, res)
   }
}
