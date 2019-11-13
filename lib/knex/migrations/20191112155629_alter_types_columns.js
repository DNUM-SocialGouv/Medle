exports.up = function(knex) {
   return knex.schema.raw(`
       alter table acts_details alter examination_type type varchar [] using array[examination_type];
       alter table acts_details alter violence_type type varchar [] using array[violence_type];
       `)
}

exports.down = function(knex) {
   return knex.schema.raw(`
        alter table acts_details alter examination_type type varchar(50) using examination_type[1];
        alter table acts_details alter violence_type type varchar(50) using violence_type[1];
        `)
}
