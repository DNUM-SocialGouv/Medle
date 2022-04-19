exports.up = async function (knex) {
  await knex.schema.table("users", function (table) {
    table.integer("login_attempts").unsigned()
    table.timestamp("login_last_attempt_at", { useTz: true })
  })
}

exports.down = async function (knex) {
  return knex.schema.table("users", (table) => {
    table.dropUnique("login_attempts")
    table.dropColumn("login_last_attempt_at")
  })
}
