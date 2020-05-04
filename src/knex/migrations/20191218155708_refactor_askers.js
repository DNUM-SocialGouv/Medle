exports.up = function (knex) {
  return knex.schema
    .table("askers", (table) => {
      table.string("name", 255).alter()
      table.string("type", 50)
      table.unique("name")
    })
    .table("employments", (table) => {
      table.renameColumn("numbers", "data_month")
    })
}

exports.down = function (knex) {
  return knex.schema
    .table("askers", (table) => {
      table.dropUnique("name")
      table.dropColumn("type")
    })
    .table("employments", (table) => {
      table.renameColumn("data_month", "numbers")
    })
}
