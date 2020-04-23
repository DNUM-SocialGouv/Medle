exports.up = function(knex) {
   return knex.schema.table("askers", function(table) {
      table.string("dep_code", 3)
      table.dropUnique("name")
   })
}

exports.down = function(knex) {
   return knex.schema.table("askers", function(table) {
      table.dropColumn("dep_code")
      table.unique("name")
   })
}
