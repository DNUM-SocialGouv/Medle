exports.up = function (knex) {
  return knex.schema
    .createTable("hospitals", function (table) {
      table.increments("id")
      table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
      table.timestamp("updated_at", { useTz: true })
      table.timestamp("deleted_at", { useTz: true })
      table.string("finesse_number", 50)
      table.string("name", 255).notNullable()
      table.string("category", 50)
      table.string("addr1", 255)
      table.string("addr2", 255)
      table.string("town", 255)
      table.string("dep_code", 3)
      table.string("postal_code", 5)

      table.json("extra_data")
    })
    .createTable("askers", function (table) {
      table.increments("id")
      table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
      table.timestamp("updated_at", { useTz: true })
      table.timestamp("deleted_at", { useTz: true })
      table.string("name", 50).notNullable()
    })
    .createTable("employments", function (table) {
      table.increments("id")
      table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
      table.timestamp("updated_at", { useTz: true })
      table.timestamp("deleted_at", { useTz: true })
      table.integer("hospital_id").unsigned()
      table.integer("year").unsigned()
      table.json("numbers")

      table.foreign("hospital_id").references("id").inTable("hospitals")

      table.unique(["hospital_id", "year"])
    })
    .createTable("users", function (table) {
      table.increments("id")
      table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
      table.timestamp("updated_at", { useTz: true })
      table.timestamp("deleted_at", { useTz: true })
      table.string("first_name", 255)
      table.string("last_name", 255)
      table.string("email", 255).notNullable()
      table.string("password", 255).notNullable()
      table.string("role", 50)
      table.integer("hospital_id").unsigned()

      table.foreign("hospital_id").references("id").inTable("hospitals")

      table.unique("email")
    })
    .createTable("acts", function (table) {
      table.increments("id")
      table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
      table.timestamp("updated_at", { useTz: true })
      table.timestamp("deleted_at", { useTz: true })
      table.string("internal_number", 255).notNullable()
      table.string("pv_number", 255)
      table.boolean("with_complaint").defaultTo(true)
      table.integer("asker_id").unsigned()
      table.integer("ets_id").unsigned()
      table.string("profile", 50)
      table.date("examination_date", 50)
      table.string("examination_date_period", 50)
      table.integer("added_by").unsigned()
      table.jsonb("extra_data")

      table.foreign("asker_id").references("id").inTable("askers")

      table.foreign("ets_id").references("id").inTable("hospitals")

      table.foreign("added_by").references("id").inTable("users")
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTable("acts")
    .dropTable("users")
    .dropTable("employments")
    .dropTable("hospitals")
    .dropTable("askers")
}
