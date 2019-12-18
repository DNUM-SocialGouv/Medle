exports.up = function(knex) {
   return knex.schema.table("askers", table => {
      table.string("name", 255).alter()
      table.string("type", 50)
      table.unique("name")
   })
}

exports.down = function(knex) {
   return knex.schema.table("askers", table => {
      table.dropUnique("name")
      table.dropColumn("type")
   })
}
