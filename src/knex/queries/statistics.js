import knex from "../../knex/knex"
import { ISO_DATE } from "../../utils/date"

export const fetchProfilesDistribution = ({ startDate, endDate, isNational, scope }) =>
   knex("acts")
      .select(
         knex.raw(
            "case " +
               "when profile = 'Personne décédée' then 'deceased' " +
               "when profile = 'Autre activité/Assises' then 'criminalCourt' " +
               "when profile = 'Autre activité/Reconstitution' then 'reconstitution' " +
               "else 'living' end as type, count(*)::integer",
         ),
      )
      .whereNull("deleted_at")
      .where(builder => {
         if (!isNational) {
            builder.whereIn("hospital_id", scope)
         }
      })
      .whereRaw(`examination_date >= TO_DATE(?, '${ISO_DATE}')`, startDate)
      .whereRaw(`examination_date <= TO_DATE(?, '${ISO_DATE}')`, endDate)
      .groupBy("type")
