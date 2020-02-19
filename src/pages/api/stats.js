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
         .orderByRaw("2 desc")
         .select("h.id", "h.name")
         .count()

      return res.status(STATUS_200_OK).json(stats)
   } catch (error) {
      // DB error
      sendAPIError(error, res)
   }
}
