import knex from "../../knex/knex"
import { transformAll } from "../../models/hospitals"

export const search = async ({ fuzzy }) => {
  const hospitals = await knex("hospitals")
    .whereNull("deleted_at")
    .where(builder => {
      if (fuzzy) {
        builder.where("name", "ilike", `%${fuzzy}%`)
      }
    })
    .orderBy("postal_code")

  return hospitals?.length ? transformAll(hospitals) : []
}
