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
      .createTable("acts", function(table) {
         table.increments("id")
         table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
         table.timestamp("updated_at", { useTz: true })
         table.timestamp("deleted_at", { useTz: true })
         table.string("internal_number", 255).notNullable()
         table.string("examined_person_type", 50)
         table.string("person_gender", 50)
         table.string("person_age_tag", 50)

         table.unique("internal_number")
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
      .createTable("acts_details", function(table) {
         table.increments("id")
         table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
         table.timestamp("updated_at", { useTz: true })
         table.timestamp("deleted_at", { useTz: true })
         table.string("pv_number", 255)
         table.string("examination_date", 50)
         table.string("asker", 255)
         table.string("examination_type", 50)
         table.string("violence_type", 50)
         table.string("period_of_day", 50)
         table.string("doctor_work_status", 50)
         table.string("blood_examination_number", 50)
         table.string("xray_examination_number", 50)
         table.string("bone_examination_number", 50)
         table.boolean("multiple_visits")

         table
            .integer("acts_id")
            .unsigned()
            .notNullable()

         table.integer("added_by").unsigned()

         table
            .foreign("acts_id")
            .references("id")
            .inTable("acts")

         table
            .foreign("added_by")
            .references("id")
            .inTable("users")
      })
}

exports.down = function(knex) {
   return knex.schema
      .dropTable("acts_details")
      .dropTable("users")
      .dropTable("acts")
      .dropTable("hospitals")
}
