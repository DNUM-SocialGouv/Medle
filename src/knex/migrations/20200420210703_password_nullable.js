exports.up = async function(knex) {
   await knex.raw("alter table users alter column password drop not null;")
}

exports.down = async function(knex) {
   await knex.raw("alter table users alter column password set not null;")
}
