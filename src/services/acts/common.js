import knex from "../../knex/knex"

export const makeWhereClause = scope => builder => {
   if (scope && scope.length) {
      builder.where(knex.raw("acts.hospital_id in (" + scope.map(() => "?").join(",") + ")", [...scope]))
   }
}
