import knex from "../../../knex/knex"
import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_404_NOT_FOUND,
   STATUS_403_FORBIDDEN,
   METHOD_GET,
} from "../../../utils/http"
import { ACT_MANAGEMENT } from "../../../utils/roles"
import { checkValidUserWithPrivilege, checkHttpMethod, sendAPIError } from "../../../utils/api"

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // 1 methods verification
      checkHttpMethod([METHOD_GET], req, res)

      // 2 privilege verification
      const currentUser = checkValidUserWithPrivilege(ACT_MANAGEMENT, req, res)
      let scope = currentUser.scope || []
      scope = [...scope, currentUser.hospitalId]

      // 3 request verification
      const { id } = req.query

      if (!id || isNaN(id)) {
         return res.status(STATUS_400_BAD_REQUEST).end()
      }

      // 4 SQL query
      const act = await knex("acts")
         .where("id", id)
         .whereNull("deleted_at")
         .first()

      if (!act) {
         return res.status(STATUS_404_NOT_FOUND).end()
      }

      // 5 scope verification
      if (act && !scope.includes(act.hospital_id)) {
         return res.status(STATUS_403_FORBIDDEN).json({ message: "Forbidden action for the user" })
      }
      await knex("acts")
         .where("id", id)
         .whereNull("deleted_at")
         .update({ deleted_at: knex.fn.now() })

      return res.status(STATUS_200_OK).end()
   } catch (error) {
      // 7 DB error
      console.error("API error", JSON.stringify(error))
      sendAPIError(error, res)
   }
}
