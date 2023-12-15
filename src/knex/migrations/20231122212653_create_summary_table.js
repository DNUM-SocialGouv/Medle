
exports.up = function (knex) {
    return knex.schema.createTable("act_summary", function (table) {
        table.increments("id")
        table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
        table.timestamp("updated_at", { useTz: true })
        table.string("category", 255)
        table.jsonb("summary")
        table.integer("hospital_id").unsigned()

        table.foreign("hospital_id").references("id").inTable("hospitals")
    })
    .then(async () => {
        await knex.raw("create index acts_summary_idx on act_summary using gin (summary JSONB_PATH_OPS);")
      });
}

exports.down = async function (knex) {
    return knex.schema.dropTable("act_summary")
}