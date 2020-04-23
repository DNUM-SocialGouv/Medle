import knex from "../../knex/knex"
import { transformAll } from "../../models/askers"

const MAX_VALUE = 100000

export const search = async ({ fuzzy, all }) => {
   const askers = await knex("askers")
      .whereNull("deleted_at")
      .where(builder => {
         if (fuzzy) {
            builder.where("name", "ilike", `%${fuzzy}%`)
         }
      })
      .limit(all ? MAX_VALUE : 10)
      .orderBy("name", "id")

   return askers && askers.length ? transformAll(askers) : []
}
