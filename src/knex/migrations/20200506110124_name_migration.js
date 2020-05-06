exports.up = function (knex) {
  return knex.schema.table("employments", function (table) {
    table.dropUnique(["hospital_id", "year"])
  })
}

exports.down = function (knex) {
  // Nothing to do. The old unique constraint on ["hospital_id", "year"] is incorrect in any context.
}
