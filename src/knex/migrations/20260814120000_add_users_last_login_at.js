exports.up = async function (knex) {
  await knex.schema.table("users", function (table) {
    table.timestamp("last_login_at", { useTz: true })
  })

  // Initialize existing users with current timestamp
  await knex("users").update({ last_login_at: knex.raw("CURRENT_TIMESTAMP") })
}

exports.down = async function (knex) {
  await knex.schema.table("users", function (table) {
    table.dropColumn("last_login_at")
  })
}