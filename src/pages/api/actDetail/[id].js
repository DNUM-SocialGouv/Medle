import knex from "../../../knex/knex"
import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_404_NOT_FOUND,
   STATUS_500_INTERNAL_SERVER_ERROR,
   METHOD_GET,
} from "../../../utils/http"
import { buildActFromDB } from "../../../knex/models/acts"
import { ACT_CONSULTATION } from "../../../utils/roles"
import { checkValidUserWithPrivilege, checkHttpMethod } from "../../../utils/api"

export default async (req, res) => {
   let act

   const { id } = req.query

   if (!id) {
      return res.status(STATUS_400_BAD_REQUEST).end()
   }

   checkHttpMethod([METHOD_GET], req, res)

   checkValidUserWithPrivilege(ACT_CONSULTATION, req, res)

   try {
      act = await knex("acts")
         .leftJoin("askers", "acts.asker_id", "askers.id")
         .join("hospitals", "acts.hospital_id", "hospitals.id")
         .join("users", "acts.added_by", "users.id")
         .where("acts.id", id)
         .select([
            "acts.*",
            "askers.name as asker_name",
            "hospitals.name as hospital_name",
            "users.email as user_email",
            "users.first_name as user_first_name",
            "users.last_name as user_last_name",
         ])
         .first()
   } catch (err) {
      return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json({ message: `Erreur de base de donnée / ${err}` })
   }

   if (act) {
      return res.status(STATUS_200_OK).json(buildActFromDB(act))
   } else {
      return res.status(STATUS_404_NOT_FOUND).end()
   }
}
