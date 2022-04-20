exports.up = function (knex) {
    return knex.schema.createTable("documents", function (table) {
      table.increments("id")
      table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
      table.timestamp("updated_at", { useTz: true })
      table.string("name", 255).notNullable()
      table.string("type_mime", 255).notNullable()
      table.integer("size").notNullable()
      table.string("type", 255)
    })
}
  
exports.down = function (knex) {
  return knex.schema.dropTable("documents")
}