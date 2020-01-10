import { STATUS_200_OK, STATUS_400_BAD_REQUEST, METHOD_POST } from "../../../utils/http"
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

      // 3 request verification
      const data = await req.body

      if (!data || !data.hospitalId) {
         console.error(
            `Bad request ${STATUS_400_BAD_REQUEST} (${currentUser.email ? currentUser.email : "unknown user"})`,
         )
         return res.status(STATUS_400_BAD_REQUEST).json({ message: "Bad request" })
      }

      // 4 SQL query
      const ids = await knex("acts").insert(buildActFromJSON(data), "id")

      return res.status(STATUS_200_OK).json({ message: `Déclaration envoyée`, detail: ids[0] })
   } catch (error) {
      // 5 DB error
      console.error("API error", JSON.stringify(error))
      sendAPIError(error, res)
   }
}
