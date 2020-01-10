import knex from "../../../knex/knex"
import { STATUS_200_OK, STATUS_400_BAD_REQUEST, STATUS_404_NOT_FOUND, METHOD_GET } from "../../../utils/http"
import { buildActFromDB } from "../../../knex/models/acts"
import { ACT_CONSULTATION } from "../../../utils/roles"
import { checkValidUserWithPrivilege, checkHttpMethod, sendAPIError } from "../../../utils/api"

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // 1 methods verification
      checkHttpMethod([METHOD_GET], req, res)

      // 2 privilege verification
      const currentUser = checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

      let scope = currentUser.scope || []
      scope = [...scope, currentUser.hospitalId]

      // 3 request verification
      const { id } = req.query

      if (!id || isNaN(id)) {
         return res.status(STATUS_400_BAD_REQUEST).end()
      }

      // 4 SQL query
      const act = await knex("acts")
         .leftJoin("askers", "acts.asker_id", "askers.id")
         .join("hospitals", "acts.hospital_id", "hospitals.id")
         .join("users", "acts.added_by", "users.id")
         .where("acts.id", id)
         .select([
            "acts.*",
            "askers.name as asker_name",
            "hospitals.name as hospital_name",
            "users.email as user_email",
            "users.first_name as user_first_name",
            "users.last_name as user_last_name",
         ])
         .first()

      // 5 scope verification
      if (act && scope.includes(act.hospital_id)) {
         return res.status(STATUS_200_OK).json(buildActFromDB(act))
      } else {
         // 6 not found error
         return res.status(STATUS_404_NOT_FOUND).end()
      }
   } catch (error) {
      // 7 DB error
      console.error("API error", JSON.stringify(error))
      sendAPIError(error, res)
   }
}
