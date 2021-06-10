const { triggerUp, triggerDown } = require("../lib")

exports.up = async function (knex) {
  await knex.schema.createTable("employments_references", function (table) {
    table.increments("id")
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
    table.timestamp("updated_at", { useTz: true })
    table.timestamp("deleted_at", { useTz: true })
    table.integer("hospital_id").unsigned()
    table.integer("year").unsigned()
    table.string("month", 2)
    table.jsonb("reference")

    table.foreign("hospital_id").references("id").inTable("hospitals")

    table.unique(["hospital_id", "year", "month"])
  })
  await knex.raw(triggerUp("employments_references"))
}

exports.down = async function (knex) {
  await knex.raw(triggerDown("employments_references"))
  await knex.schema.dropTable("employments_references")
}
