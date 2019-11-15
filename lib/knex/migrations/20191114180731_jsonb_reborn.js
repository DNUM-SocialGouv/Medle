exports.up = function(knex) {
   return knex.schema
      .createTable("cases", function(table) {
         table.increments("id")
         table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
         table.timestamp("updated_at", { useTz: true })
         table.timestamp("deleted_at", { useTz: true })
         table.string("internal_number", 255).notNullable()
         table.string("case_type", 50)

         table.unique("internal_number")
      })
      .createTable("cases_requests", function(table) {
         table.increments("id")
         table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
         table.timestamp("updated_at", { useTz: true })
         table.timestamp("deleted_at", { useTz: true })
         table.string("pv_number", 255)
         table.string("examination_date", 50)
         table.string("asker", 255)

         table
            .integer("cases_fk")
            .unsigned()
            .notNullable()

         table.integer("added_by").unsigned()

         table
            .foreign("cases_fk")
            .references("id")
            .inTable("cases")

         table
            .foreign("added_by")
            .references("id")
            .inTable("users")

         table.jsonb("data")
      })
}

exports.down = function(knex) {
   return knex.schema.dropTable("cases_requests").dropTable("cases")
}
