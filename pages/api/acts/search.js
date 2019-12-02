import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"
import knex from "../../../lib/knex/knex"

export default async (req, res) => {
   if (req.method !== "GET") {
      console.error(`Méthode non permise ${STATUS_405_METHOD_NOT_ALLOWED}`)
      return res.status(STATUS_405_METHOD_NOT_ALLOWED).end()
   }

   res.setHeader("Content-Type", "application/json")

   const { etsId, asker, internalNumber, pvNumber, profile, fuzzy } = req.query

   const filters = {}
   const orFilters = {}

   if (etsId) {
      if (/[0-9]+/.test(etsId)) {
         filters.ets_id = etsId
      } else {
         return res.status(STATUS_400_BAD_REQUEST).end()
      }
   }

   let acts

   try {
      if (fuzzy) {
         console.log("fuzzy", fuzzy)
         console.log("fuzzy", !!fuzzy)
         acts = await knex("acts")
            .whereNull("acts.deleted_at")
            .where({ ...filters })
            .where(function() {
               this.where("internal_number", fuzzy)
                  .orWhere("pv_number", fuzzy)
                  .orWhere("profile", "like", `%${fuzzy}%`)
            })
            .orderBy([{ column: "acts.created_at", order: "desc" }])
            .select("*")
      } else {
         acts = await knex("acts")
            .whereNull("acts.deleted_at")
            .where({ ...filters })
            .orderBy([{ column: "acts.created_at", order: "desc" }])
            .select("*")
      }

      return res.status(STATUS_200_OK).json(acts)
   } catch (error) {
      console.error(error)
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
         error: `Erreur serveur base de données`,
         error_description: error,
         error_uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
      })
   }
}
