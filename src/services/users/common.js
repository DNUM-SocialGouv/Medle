import knex from "../../knex/knex"
import { normalizeKeepCase } from "normalize-diacritics-es"

export const makeWhereClause = ({ scope, fuzzy }) => (builder) => {
  builder.whereNull("users.deleted_at")
  if (scope?.length) {
    builder.where(knex.raw("hospital_id in (" + scope.map(() => "?").join(",") + ")", [...scope]))
  }

  if (fuzzy) {
    builder.where(function () {
      this.whereRaw(`unaccent(last_name) ILIKE ?`, [`%${normalizeKeepCase(fuzzy)}%`])
        .orWhereRaw(`unaccent(first_name) ILIKE ?`, [`%${normalizeKeepCase(fuzzy)}%`])
        .orWhereRaw(`unaccent(email) ILIKE ?`, [`%${normalizeKeepCase(fuzzy)}%`])
    })
  }
}
