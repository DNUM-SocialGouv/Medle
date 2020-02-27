const v1 = require("../versions/views/acts_by_day/v1")

exports.up = async function(knex) {
   await knex.raw(v1.up)
}

exports.down = async function(knex) {
   await knex.raw(v1.down)
}
