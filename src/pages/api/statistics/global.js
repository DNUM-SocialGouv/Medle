import Cors from "micro-cors"
import moment from "moment"

import { STATUS_200_OK, STATUS_400_BAD_REQUEST, METHOD_POST, METHOD_OPTIONS } from "../../../utils/http"
import knex from "../../../knex/knex"
import { STATS_GLOBAL } from "../../../utils/roles"
import { checkValidUserWithPrivilege, sendAPIError } from "../../../utils/api"
import { logError } from "../../../utils/logger"
import { now, FORMAT_DATE } from "../../../utils/date"

const handler = async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // privilege verification
      const currentUser = checkValidUserWithPrivilege(STATS_GLOBAL, req, res)

      let scope = currentUser.scope || []
      scope = currentUser.hospitalId ? [...scope, currentUser.hospitalId] : scope

      // request verification
      let { startDate, endDate, isNational } = await req.body

      const defaultEndDate = now()
      const defaultStartDate = date => moment(date).startOf("year")

      if (!endDate) {
         endDate = defaultEndDate
      } else {
         endDate = moment(endDate, FORMAT_DATE)
         endDate = endDate.isValid() ? endDate : defaultEndDate
      }

      if (!startDate) {
         startDate = defaultStartDate(endDate)
      } else {
         startDate = moment(startDate, FORMAT_DATE)
         startDate = startDate.isValid() && startDate.isBefore(endDate) ? startDate : defaultStartDate(endDate)
      }

      isNational = isNational === true

      console.log(
         "xxxx",
         startDate.format(FORMAT_DATE),
         endDate.format(FORMAT_DATE),
         isNational,
         ":" + JSON.stringify(scope) + ":",
      )

      //   if (!data || !data.hospitalId) {
      //      logError(`Bad request ${STATUS_400_BAD_REQUEST} (${currentUser.email ? currentUser.email : "unknown user"})`)
      //      return res.status(STATUS_400_BAD_REQUEST).json({ message: "Bad request" })
      //   }

      //   // SQL query
      //   const ids = await knex("acts").insert(buildActFromJSON(data), "id")

      const [globalCount] = await knex("acts")
         .whereNull("deleted_at")
         .whereIn("hospital_id", scope)
         .whereRaw(`created_at >= TO_DATE(?, '${FORMAT_DATE}')`, startDate.format(FORMAT_DATE))
         .whereRaw(`created_at <= TO_DATE(?, '${FORMAT_DATE}')`, endDate.format(FORMAT_DATE))
         .count()

      // and hospital_id = ANY(:hids) -- ex: '{5, 6, 7}'
      // and created_at > TO_DATE(:start, 'DD/MM/YYYY')
      // and created_at <= current_date;

      console.log("globalCount", globalCount.count)

      return res.status(STATUS_200_OK).json({
         inputs: {
            startDate: startDate.format(FORMAT_DATE),
            endDate: endDate.format(FORMAT_DATE),
            isNational,
            scope,
         },
         globalCount,
      })
   } catch (error) {
      // DB error
      sendAPIError(error, res)
   }
}

const cors = Cors({
   allowMethods: [METHOD_POST, METHOD_OPTIONS],
})

export default cors(handler)
