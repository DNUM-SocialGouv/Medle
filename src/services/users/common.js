import knex from "../../knex/knex"

export const makeWhereClause = ({ scope, fuzzy }) => (builder) => {
  builder.whereNull("users.deleted_at")
  if (scope?.length) {
    builder.where(knex.raw("hospital_id in (" + scope.map(() => "?").join(",") + ")", [...scope]))
  }

  if (fuzzy) {
    builder.where(function () {
      this.where("last_name", "ilike", `%${fuzzy}%`)
        .orWhere("first_name", "ilike", `%${fuzzy}%`)
        .orWhere("email", "ilike", `%${fuzzy}%`)
    })
  }
}
