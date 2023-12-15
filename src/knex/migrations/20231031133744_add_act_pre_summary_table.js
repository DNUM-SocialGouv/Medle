
exports.up = function (knex) {
  return knex.schema.createTable("act_pre_summary", function (table) {
    table.increments("id")
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
    table.timestamp("updated_at", { useTz: true })
    table.date("examination_date", 255).notNullable()
    table.string("examined", 255)
    table.string("act_type", 255)
    table.string("violence_type", 255)
    table.string("location", 255)
    table.string("age", 255)
    table.integer("act_duration", 255).notNullable()
    table.string("category", 255)
    table.float("ponderation")

    table.integer("added_by").unsigned()
    table.integer("hospital_id").unsigned()


    table.foreign("added_by").references("id").inTable("users")

    table.foreign("hospital_id").references("id").inTable("hospitals")
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable("act_pre_summary")
}