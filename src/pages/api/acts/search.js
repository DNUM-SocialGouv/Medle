import {
   STATUS_200_OK,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"
import knex from "../../../knex/knex"

export default async (req, res) => {
   if (req.method !== "GET") {
      console.error(`Méthode non permise ${STATUS_405_METHOD_NOT_ALLOWED}`)
      return res.status(STATUS_405_METHOD_NOT_ALLOWED).end()
   }

   const { scope: _scope } = req.cookies

   console.log("cookies", _scope)

   const scope = _scope ? JSON.parse(_scope) : []

   res.setHeader("Content-Type", "application/json")

   const { fuzzy } = req.query

   let acts

   try {
      acts = await knex("acts")
         .whereNull("acts.deleted_at")
         .where(builder => {
            if (scope.length) {
               builder.where(knex.raw("hospital_id in (" + scope.map(() => "?").join(",") + ")", [...scope]))
            }

            if (fuzzy) {
               builder.where(function() {
                  this.where("internal_number", fuzzy)
                     .orWhere("pv_number", fuzzy)
                     .orWhere("profile", "ilike", `%${fuzzy}%`)
               })
            }
         })
         .orderBy([{ column: "acts.created_at", order: "desc" }])
         .select("*")

      return res.status(STATUS_200_OK).json(acts)
   } catch (error) {
      console.error(error)
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
         error: `Erreur serveur base de données`,
         message: error,
         uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
      })
   }
}
