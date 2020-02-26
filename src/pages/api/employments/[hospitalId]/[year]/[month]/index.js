import Cors from "micro-cors"

import knex from "../../../../../../knex/knex"
import upsert from "../../../../../../knex/knex-upsert"
import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_404_NOT_FOUND,
   METHOD_GET,
   METHOD_PUT,
   METHOD_OPTIONS,
} from "../../../../../../utils/http"
import { EMPLOYMENT_CONSULTATION, EMPLOYMENT_MANAGEMENT } from "../../../../../../utils/roles"
import { checkValidUserWithPrivilege, sendAPIError } from "../../../../../../utils/api"

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // privilege verification
      checkValidUserWithPrivilege(EMPLOYMENT_CONSULTATION, req, res)

      if (req.method === METHOD_PUT) {
         checkValidUserWithPrivilege(EMPLOYMENT_MANAGEMENT, req, res)
      }

      // request verification
      const { year, month, hospitalId } = req.query

      if (!year || !hospitalId || !/^[0-9]{4}$/.test(year) || !/^[0-9]+$/.test(hospitalId)) {
         return res.status(STATUS_400_BAD_REQUEST).end()
      }

      // SQL query
      if (req.method === METHOD_GET) {
         const [results] = await knex("employments")
            .whereNull("deleted_at")
            .where("year", year)
            .where("month", month)
            .where("hospital_id", hospitalId)
            .select("data_month")

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
      // DB error
      sendAPIError(error, res)
   }
}

const cors = Cors({
   allowMethods: [METHOD_GET, METHOD_PUT, METHOD_OPTIONS],
})

export default cors(handler)
