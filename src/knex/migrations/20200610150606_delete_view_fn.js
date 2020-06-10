const view_v4 = require("../versions/views/acts_by_day/v4")
const function_v2 = require("../versions/functions/avg_acts/v2")

exports.up = async function (knex) {
  // remove function and view not necessary anymore
  await knex.raw(function_v2.down)
  await knex.raw(view_v4.down)
}

exports.down = async function (knex) {
  await knex.raw(view_v4.up)
  await knex.raw(function_v2.up)
}
