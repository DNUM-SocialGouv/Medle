import { STATUS_200_OK, STATUS_500_INTERNAL_SERVER_ERROR, METHOD_POST } from "../../../utils/http"
import knex from "../../../knex/knex"
import { buildActFromJSON } from "../../../knex/models/acts"
import { ACT_MANAGEMENT } from "../../../utils/roles"
import { checkValidUserWithPrivilege, checkHttpMethod } from "../../../utils/api"

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   checkHttpMethod([METHOD_POST], req, res)

   checkValidUserWithPrivilege(ACT_MANAGEMENT, req, res)

   const data = await req.body

   knex("acts")
      .insert(buildActFromJSON(data), "id")
      .then(ids => {
         return res.status(STATUS_200_OK).json({ message: `Déclaration envoyée`, detail: ids[0] })
      })
      .catch(error => {
         console.error(JSON.stringify(error))
         return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
            error: `Erreur serveur base de données`,
            message: error,
            uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
         })
      })
}
