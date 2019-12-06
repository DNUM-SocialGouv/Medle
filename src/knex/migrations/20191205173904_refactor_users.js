exports.up = function(knex) {
   return knex.schema.table("users", table => {
      table.jsonb("scope")
   })
}

exports.down = function(knex) {
   return knex.schema.table("users", table => {
      table.dropColumn("scope")
   })
}
