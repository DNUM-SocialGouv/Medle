exports.up = function(knex) {
   return knex.schema
      .createTable("hospitals", function(table) {
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
         table.string("phone_number", 50)
         table.string("fax_number", 50)
         table.string("email", 255)
         table.string("website", 255)
         table.integer("workforce").unsigned()
      })
      .createTable("users", function(table) {
         table.increments("id")
         table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
         table.timestamp("updated_at", { useTz: true })
         table.timestamp("deleted_at", { useTz: true })
         table.string("first_name", 255)
         table.string("last_name", 255)
         table.string("email", 255).notNullable()
         table.string("password", 255).notNullable()
         table.string("profile", 50)

         table.integer("hospital_id").unsigned()

         table
            .foreign("hospital_id")
            .references("id")
            .inTable("hospitals")

         table.unique("email")
      })
      .createTable("cases", function(table) {
         table.increments("id")
         table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
         table.timestamp("updated_at", { useTz: true })
         table.timestamp("deleted_at", { useTz: true })
         table.string("internal_number", 255).notNullable()
         table.string("case_type", 50)
         table.integer("ets_id", 50).unsigned()
         table.jsonb("data")

         table
            .foreign("ets_id")
            .references("id")
            .inTable("hospitals")

         table.unique("internal_number")
      })
      .createTable("acts", function(table) {
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
   return knex.schema
      .dropTable("acts")
      .dropTable("cases")
      .dropTable("users")
      .dropTable("hospitals")
}
