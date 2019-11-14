exports.up = function(knex) {
   // return knex.schema.raw(`
   //     alter table acts_details alter examination_type type varchar [] using array[examination_type];
   //     alter table acts_details alter violence_type type varchar [] using array[violence_type];
   //     `)
   return knex.schema.alterTable("acts_details", function(table) {
      table.dropColumn("examination_type")
      table.specificType("examination_types", "varchar []")
      table.dropColumn("violence_type")
      table.specificType("violence_types", "varchar []")
   })
}

exports.down = function(knex) {
   // return knex.schema.raw(`
   //      alter table acts_details alter examination_type type varchar(50) using examination_type[1];
   //      alter table acts_details alter violence_type type varchar(50) using violence_type[1];
   //      `)

   return knex.schema.alterTable("acts_details", function(table) {
      table.string("examination_type", 50)
      table.string("violence_type", 50)

      table.dropColumn("examination_types")
      table.dropColumn("violence_types")
   })
}
