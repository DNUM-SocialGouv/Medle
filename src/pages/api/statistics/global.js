import Cors from "micro-cors"
import moment from "moment"

import { STATUS_200_OK, METHOD_POST, METHOD_OPTIONS } from "../../../utils/http"
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

      const [globalCount] = await knex("acts")
         .select(knex.raw("count(1)::integer"))
         .whereNull("deleted_at")
         .where(builder => {
            if (!isNational) {
               builder.whereIn("hospital_id", scope)
            }
         })
         .whereRaw(`created_at >= TO_DATE(?, '${FORMAT_DATE}')`, startDate.format(FORMAT_DATE))
         .whereRaw(`created_at <= TO_DATE(?, '${FORMAT_DATE}')`, endDate.format(FORMAT_DATE))

      const [averageCount] = await knex("acts_by_day")
         .select(knex.raw("avg(nb_acts)::integer"))
         .whereIn("hospital_id", scope)
         .whereRaw(`day >= TO_DATE(?, '${FORMAT_DATE}')`, startDate.format(FORMAT_DATE))
         .whereRaw(`day <= TO_DATE(?, '${FORMAT_DATE}')`, endDate.format(FORMAT_DATE))

      const livingDeadOthers = await knex("acts")
         .select(
            knex.raw(
               "case " +
                  "when profile = 'Personne décédée' then 'Thanato' " +
                  "when profile = 'Autre activité/Assises' then 'Assises' " +
                  "when profile = 'Autre activité/Reconstitution' then 'Reconstitution' " +
                  "else 'Vivant' end as type, count(*)::integer",
            ),
         )
         .whereNull("deleted_at")
         .where(builder => {
            if (!isNational) {
               builder.whereIn("hospital_id", scope)
            }
         })
         .whereRaw(`created_at >= TO_DATE(?, '${FORMAT_DATE}')`, startDate.format(FORMAT_DATE))
         .whereRaw(`created_at <= TO_DATE(?, '${FORMAT_DATE}')`, endDate.format(FORMAT_DATE))
         .groupBy("type")

      const [actsWithSamePV] = await knex
         .with("acts_with_same_pv", builder => {
            builder
               .select(knex.raw("pv_number, count(1) as count"))
               .from("acts")
               .whereNull("deleted_at")
               .where(builder => {
                  if (!isNational) {
                     builder.whereIn("hospital_id", scope)
                  }
               })
               .whereRaw(`created_at >= TO_DATE(?, '${FORMAT_DATE}')`, startDate.format(FORMAT_DATE))
               .whereRaw(`created_at <= TO_DATE(?, '${FORMAT_DATE}')`, endDate.format(FORMAT_DATE))
               .whereRaw("pv_number is not null and pv_number <> ''")
               .groupBy("pv_number")
               .havingRaw("count(1) > 1")
         })
         .select(knex.raw("sum(count)::integer"))
         .from("acts_with_same_pv")

      const [averageWithSamePV] = await knex
         .with("acts_with_same_pv", builder => {
            builder
               .select(knex.raw("count(*) as count"))
               .from("acts")
               .whereNull("deleted_at")
               .where(builder => {
                  if (!isNational) {
                     builder.whereIn("hospital_id", scope)
                  }
               })
               .whereRaw(`created_at >= TO_DATE(?, '${FORMAT_DATE}')`, startDate.format(FORMAT_DATE))
               .whereRaw(`created_at <= TO_DATE(?, '${FORMAT_DATE}')`, endDate.format(FORMAT_DATE))
               .whereRaw("pv_number is not null and pv_number <> ''")
               .groupBy("pv_number")
         })
         .select(knex.raw("avg(count)::integer"))
         .from("acts_with_same_pv")

      return res.status(STATUS_200_OK).json({
         inputs: {
            startDate: startDate.format(FORMAT_DATE),
            endDate: endDate.format(FORMAT_DATE),
            isNational,
            scope,
         },
         globalCount: globalCount.count || 0,
         averageCount: averageCount.avg || 0,
         livingDeadOthers: livingDeadOthers.reduce(
            (acc, current) => ({ ...acc, [current.type]: current.count || 0 }),
            {},
         ),
         actsWithSamePV: actsWithSamePV.sum || 0,
         averageWithSamePV: averageWithSamePV.avg || 0,
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
