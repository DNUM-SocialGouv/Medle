exports.up = function(knex) {
   return knex.schema
      .table("acts", function(table) {
         table.dropColumn("examination_date_period")
         table.dropColumn("with_complaint")
         table.dropForeign("ets_id")
         table.dropColumn("ets_id")

         table.integer("hospital_id").unsigned()

         table
            .foreign("hospital_id")
            .references("id")
            .inTable("hospitals")
      })
      .table("hospitals", function(table) {
         table.jsonb("extra_data").alter()
      })
      .table("employments", function(table) {
         table.jsonb("numbers").alter()
         table.string("month", 2)

         // table.dropUnique(["hospital_id", "year"])
         table.unique(["hospital_id", "year", "month"])
      })
}

exports.down = function(knex) {
   return knex.schema
      .table("acts", function(table) {
         table.dropForeign("hospital_id")
         table.dropColumn("hospital_id")

         table.integer("ets_id").unsigned()
         table
            .foreign("ets_id")
            .references("id")
            .inTable("hospitals")

         table.boolean("with_complaint").defaultTo(true)
         table.string("examination_date_period", 50)
      })
      .table("employments", function(table) {
         table.dropColumn("month")

         table.dropUnique(["hospital_id", "year", "month"])
         //table.unique(["hospital_id", "year"]) // Impossible, car cela introduirait des doublons sur hospital_id+year
      })
}
