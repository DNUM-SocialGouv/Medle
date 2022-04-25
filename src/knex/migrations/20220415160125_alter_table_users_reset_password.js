exports.up = async function (knex) {
  await knex.schema.table("users", function (table) {
    table.boolean("reset_password")
  })

  const rows = await knex("users").select("id")

  rows.forEach(async (row) => {
    await knex("users")
      .update({
        reset_password: true,
      })
      .where("id", row.id)
  })
}

exports.down = async function (knex) {
  const rows = await knex("users").select("id")
  rows.forEach(async (row) => {
    await knex("users")
      .update({
        reset_password: undefined,
      })
      .where("id", row.id)
  })

  await knex.schema.table("users", function (table) {
    table.dropColumn("reset_password")
  })
}
