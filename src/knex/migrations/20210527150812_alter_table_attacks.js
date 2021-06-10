exports.up = async function (knex) {
  await knex.schema.table("attacks", function (table) {
    table.integer("year").unsigned()
  })

  const rows = await knex("attacks").select("id", "name", "year")

  rows.forEach(async (row) => {
    var splitedName = row.name.split(" ")
    if (splitedName.length > 1 && Number(splitedName[0])) {
      await knex("attacks")
        .update({
          name: row.name.substring(splitedName[0].length + 1),
          year: Number(splitedName[0]),
        })
        .where("id", row.id)
    }
  })
}

exports.down = async function (knex) {
  const rows = await knex("attacks").select("id", "name", "year")
  rows.forEach(async (row) => {
    if (row.year != undefined) {
      await knex("attacks")
        .update({
          name: row.year + " " + row.name,
          year: undefined,
        })
        .where("id", row.id)
    }
  })

  await knex.schema.table("attacks", function (table) {
    table.dropColumn("year")
  })
}
