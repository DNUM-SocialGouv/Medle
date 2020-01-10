import knex from "../../../knex/knex"
import { STATUS_200_OK, STATUS_400_BAD_REQUEST, STATUS_404_NOT_FOUND, METHOD_GET } from "../../../utils/http"
import { NO_PRIVILEGE_REQUIRED } from "../../../utils/roles"
import { checkHttpMethod, checkValidUserWithPrivilege, sendAPIError } from "../../../utils/api"

export default async (req, res) => {
   try {
      // 1 methods verification
      checkHttpMethod([METHOD_GET], req, res)

      // 2 privilege verification
      checkValidUserWithPrivilege(NO_PRIVILEGE_REQUIRED, req, res)

      // 3 request verification
      const { id } = req.query

      if (!id || isNaN(id)) {
         return res.status(STATUS_400_BAD_REQUEST).end()
      }

      // 3 SQL query
      const hospital = await knex("hospitals")
         .where("id", id)
         .first()

      if (hospital) {
         return res.status(STATUS_200_OK).json(hospital)
      } else {
         return res.status(STATUS_404_NOT_FOUND).end()
      }
   } catch (error) {
      // 4 DB error
      console.error("API error", JSON.stringify(error))
      sendAPIError(error, res)
   }
}
