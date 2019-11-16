import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../../../utils/HttpStatus"
import knex from "../../../lib/knex/knex"
import Treeize from "treeize"

const getCaseData = data => ({
   internal_number: data.internalNumber,
   case_type: data.caseType,
   ets_id: data.etsId,
   data: JSON.stringify(data.commonData),
})

export default async (req, res) => {
   if (req.method !== "GET") {
      console.error(`Méthode non permise ${STATUS_405_METHOD_NOT_ALLOWED}`)
      return res.status(STATUS_405_METHOD_NOT_ALLOWED).end()
   }

   res.setHeader("Content-Type", "application/json")

   const { etsId, asker, internalNumber, pvNumber, caseType } = req.query

   const filters = {}

   if (etsId) {
      if (/[0-9]+/.test(etsId)) {
         filters.ets_id = etsId
      } else {
         return res.status(STATUS_400_BAD_REQUEST).end()
      }
   }

   console.log("query", etsId)

   let cases

   try {
      cases = await knex("cases as cases")
         .leftJoin("acts as acts", "cases.id", "acts.cases_fk")
         .whereNull("acts.deleted_at")
         .where({ ...filters })
         .orderBy([{ column: "cases.created_at", order: "desc" }, { column: "acts.created_at", order: "desc" }])
         .select([
            "cases.*",
            "cases.id as id*", // * needed by Treeize, to group correctly the rows (grouped by cases.id)
            "acts.id as acts:id",
            "acts.created_at as acts:created_at",
            "acts.updated_at as acts:updated_at",
            "acts.deleted_at as acts:deleted_at",
            "acts.pv_number as acts:pv_number",
            "acts.examination_date as acts:examination_date",
            "acts.asker as acts:asker",
            "acts.added_by as acts:added_by",
            "acts.data as acts:data",
            "acts.cases_fk as acts:cases_fk",
         ])

      const newCases = new Treeize()
      newCases.grow(cases)

      return res.status(STATUS_200_OK).json(newCases.getData())
   } catch (error) {
      console.error(error)
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({
         error: `Erreur serveur base de données`,
         error_description: error,
         error_uri: "https://docs.postgresql.fr/8.3/errcodes-appendix.html",
      })
   }
}
