exports.up = async function (knex) {
  await knex.schema.createTable("app_settings", function (table) {
    table.increments("id")
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
    table.timestamp("updated_at", { useTz: true })
    table.string("key", 255).notNullable().unique()
    table.string("value", 255).notNullable()
  })

  await knex("app_settings").insert({
    key: "users_purge_inactivity_days",
    value: "365",
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable("app_settings")
}