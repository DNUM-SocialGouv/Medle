import knex from "../../../../../../knex/knex"
import upsert from "../../../../../../knex/knex-upsert"
import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_404_NOT_FOUND,
   METHOD_GET,
   METHOD_PUT,
} from "../../../../../../utils/http"
import { EMPLOYMENT_CONSULTATION, EMPLOYMENT_MANAGEMENT } from "../../../../../../utils/roles"
import { checkValidUserWithPrivilege, checkHttpMethod, sendAPIError } from "../../../../../../utils/api"

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // 1 methods verification
      checkHttpMethod([METHOD_GET, METHOD_PUT], req, res)

      // 2 privilege verification
      checkValidUserWithPrivilege(EMPLOYMENT_CONSULTATION, req, res)

      if (req.method === METHOD_PUT) {
         checkValidUserWithPrivilege(EMPLOYMENT_MANAGEMENT, req, res)
      }

      // 3 request verification
      const { year, month, hospitalId } = req.query

      if (!year || !hospitalId || !/^[0-9]{4}$/.test(year) || !/^[0-9]+$/.test(hospitalId)) {
         return res.status(STATUS_400_BAD_REQUEST).end()
      }

      // 4 SQL query
      if (req.method === METHOD_GET) {
         const results = await knex("employments")
            .whereNull("deleted_at")
            .where("year", year)
            .where("month", month)
            .where("hospital_id", hospitalId)
            .select("data_month")
            .first()

         if (results) {
            return res.status(STATUS_200_OK).json(results.data_month)
         } else {
            // Pas de données la 1ère fois. TODO mieux gérer
            return res.status(STATUS_200_OK).json({})
         }
      } else if (req.method === METHOD_PUT) {
         const data = await req.body

         const result = await upsert({
            table: "employments",
            object: {
               hospital_id: hospitalId,
               year,
               month,
               data_month: JSON.stringify(data),
               updated_at: knex.fn.now(),
            },
            constraint: "(hospital_id, year, month)",
         })
         return result ? res.status(STATUS_200_OK).json(result) : res.status(STATUS_404_NOT_FOUND).end()
      }
   } catch (error) {
      // 5 DB error
      console.error("API error", JSON.stringify(error))
      sendAPIError(error, res)
   }
}
