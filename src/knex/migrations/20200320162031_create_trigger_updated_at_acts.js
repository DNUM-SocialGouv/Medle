const v1 = require("../versions/functions/updated_at_auto/v1")

exports.up = async function(knex) {
   await knex.raw(v1.up)
   await knex.raw(
      `create trigger updated_at_auto before update on acts for each row execute procedure updated_at_auto();`,
   )
}

exports.down = async function(knex) {
   await knex.raw(`drop trigger if exists updated_at_auto on acts;`)
   await knex.raw(v1.down)
}
