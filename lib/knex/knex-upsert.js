import knex from "./knex"

const upsert = params => {
   const { table, object, constraint } = params
   const insert = knex(table).insert(object)
   const update = knex.queryBuilder().update(object)
   return knex
      .raw(`? ON CONFLICT ${constraint} DO ? returning *`, [insert, update])
      .get("rows")
      .get(0)
}

export default upsert
