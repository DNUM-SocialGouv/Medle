exports.up = function (knex) {
  return knex.schema.createTable("messages", function (table) {
    table.increments("id")
    table.date("start_date")
    table.date("end_date")
    table.string("content", 500).notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable("messages")
}
