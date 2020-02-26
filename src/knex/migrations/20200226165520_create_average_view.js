const v1 = require("../versions/views/average_acts/v1")

exports.up = async function(knex) {
   await knex.raw(v1.up)
}

exports.down = async function(knex) {
   await knex.raw(v1.down)
}
