import knex from "../../../../../../knex/knex"
import upsert from "../../../../../../knex/knex-upsert"
import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_404_NOT_FOUND,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../../../../utils/HttpStatus"

export default async (req, res) => {
   if (!["GET", "PUT"].includes(req.method)) {
      console.error(`Méthode non permise ${STATUS_405_METHOD_NOT_ALLOWED}`)
      return res.status(STATUS_405_METHOD_NOT_ALLOWED).end()
   }

   const { year, month, hospitalId } = req.query

   if (!year || !hospitalId || !/^[0-9]{4}$/.test(year) || !/^[0-9]+$/.test(hospitalId)) {
      return res.status(STATUS_400_BAD_REQUEST).end()
   }

   res.setHeader("Content-Type", "application/json")

   if (req.method === "GET") {
      let results
      try {
         results = await knex("employments")
            .whereNull("deleted_at")
            .where("year", year)
            .where("month", month)
            .where("hospital_id", hospitalId)
            .select("data_month")
            .first()
      } catch (error) {
         return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
            error: `Erreur serveur base de données`,
            message: error,
            uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
         })
      }

      if (results) {
         return res.status(STATUS_200_OK).json(results.data_month)
      } else {
         // Pas de données la 1ère fois. TODO mieux gérer
         return res.status(STATUS_200_OK).json({})
      }
   } else if (req.method === "PUT") {
      const data = await req.body

      let result
      try {
         result = await upsert({
            table: "employments",
            object: {
               hospital_id: hospitalId,
               year,
               month,
               data_month: JSON.stringify(data),
               updated_at: knex.fn.now(),
            },
            constraint: "(hospital_id, year, month)",
         })
      } catch (error) {
         return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
            error: `Erreur serveur base de données`,
            message: error,
            uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
         })
      }

      return result ? res.status(STATUS_200_OK).json(result) : res.status(STATUS_404_NOT_FOUND).end()
   }
}
