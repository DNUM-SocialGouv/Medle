exports.up = function(knex) {
   return knex.schema.table("acts", function(table) {
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
}

exports.down = function(knex) {
   return knex.schema.table("acts", function(table) {
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
}
