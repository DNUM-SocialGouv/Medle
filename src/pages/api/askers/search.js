import { STATUS_200_OK, STATUS_500_INTERNAL_SERVER_ERROR, METHOD_GET } from "../../../utils/http"
import knex from "../../../knex/knex"
import { checkHttpMethod } from "../../../utils/api"

export default async (req, res) => {
   res.setHeader("Content-Type", "application/json")

   checkHttpMethod([METHOD_GET], req, res)

   const { fuzzy } = req.query

   let askers

   try {
      askers = await knex("askers")
         .whereNull("deleted_at")
         .where(builder => {
            if (fuzzy) {
               builder.where("name", "ilike", `%${fuzzy}%`)
            }
         })
         .orderBy("name")
         .select("id", "name")
         .limit(5)

      return res.status(STATUS_200_OK).json(askers)
   } catch (error) {
      console.error(error)
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
         error: `Erreur serveur base de données`,
         message: error,
         uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
      })
   }
}
