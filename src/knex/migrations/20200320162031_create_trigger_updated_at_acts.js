const v1 = require("../versions/functions/updated_at_auto/v1")
const v1Trigger = require("../versions/triggers/updated_at_auto_acts/v1")

exports.up = async function(knex) {
   await knex.raw(v1.up)
   await knex.raw(v1Trigger.up)
}

exports.down = async function(knex) {
   await knex.raw(v1Trigger.down)
   await knex.raw(v1.down)
}
