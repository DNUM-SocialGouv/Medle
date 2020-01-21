exports.up = function(knex) {
   return knex.schema.createTable("attacks", function(table) {
      table.increments("id")
      table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
      table.timestamp("updated_at", { useTz: true })
      table.timestamp("deleted_at", { useTz: true })
      table.string("name", 255).notNullable()
   })
}

exports.down = function(knex) {
   return knex.schema.dropTable("attacks")
}
