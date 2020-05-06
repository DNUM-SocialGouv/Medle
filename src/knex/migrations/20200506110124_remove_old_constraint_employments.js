exports.up = function (knex) {
  return knex.schema.table("employments", function (table) {
    table.dropUnique(["hospital_id", "year"])
  })
}

exports.down = function (knex) {
  // Added only for reproductibility of migrate/rollback operations. In theory, you should never go back to the ["hospital_id", "year"] constraint.
  return knex.schema.table("employments", function (table) {
    table.unique(["hospital_id", "year"])
  })
}
