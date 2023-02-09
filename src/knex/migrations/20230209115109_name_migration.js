exports.up = function (knex) {
  return knex.schema.table("messages", function (table) {
    table.string("content", 1000).alter()
  })
}

exports.down = function (knex) {
  return knex.schema.table("messages", function (table) {
    table.string("content", 500).alter()
  })
}
