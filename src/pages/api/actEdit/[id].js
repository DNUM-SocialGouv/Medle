import { STATUS_200_OK, STATUS_400_BAD_REQUEST, STATUS_403_FORBIDDEN, METHOD_POST } from "../../../utils/http"
import knex from "../../../knex/knex"
import { buildActFromJSON } from "../../../knex/models/acts"
import { ACT_MANAGEMENT } from "../../../utils/roles"
import { checkValidUserWithPrivilege, checkHttpMethod, sendAPIError } from "../../../utils/api"

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   try {
      // 1 methods verification
      checkHttpMethod([METHOD_POST], req, res)

      // 2 privilege verification
      const currentUser = checkValidUserWithPrivilege(ACT_MANAGEMENT, req, res)

      let scope = currentUser.scope || []
      scope = [...scope, currentUser.hospitalId]

      // 3 request verification
      const { id } = req.query
      if (!id || isNaN(id)) {
         return res.status(STATUS_400_BAD_REQUEST).end()
      }

      const data = await req.body

      // 4 scope verification
      if (!data || !data.hospitalId) {
         console.error(
            `Bad request ${STATUS_400_BAD_REQUEST} (${currentUser.email ? currentUser.email : "unknown user"})`,
         )
         return res.status(STATUS_400_BAD_REQUEST).json({ message: "Bad request" })
      }

      if (!scope || !scope.includes(data.hospitalId)) {
         console.error(
            `Forbidden action for the user ${STATUS_403_FORBIDDEN} (${
               currentUser.email ? currentUser.email : "unknown user"
            })`,
         )
         return res.status(STATUS_403_FORBIDDEN).json({ message: "Forbidden action for the user" })
      }

      // 5 SQL query
      await knex("acts")
         .update(buildActFromJSON(data))
         .where("id", id)

      return res.status(STATUS_200_OK).json({ message: `Acte ${id} modifié` })
   } catch (error) {
      // 7 DB error
      console.error("API error", JSON.stringify(error))
      sendAPIError(error, res)
   }
}
