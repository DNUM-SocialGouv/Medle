const view_v2 = require("../versions/views/acts_by_day/v2")
const view_v3 = require("../versions/views/acts_by_day/v3")

const function_v1 = require("../versions/functions/avg_acts/v1")
const function_v2 = require("../versions/functions/avg_acts/v2")

exports.up = async function (knex) {
  await knex.raw(function_v1.down)
  await knex.raw(view_v2.down)
  await knex.raw(view_v3.up)
  await knex.raw(function_v2.up)
}

exports.down = async function (knex) {
  await knex.raw(function_v2.down)
  await knex.raw(view_v3.down)
  await knex.raw(view_v2.up)
  await knex.raw(function_v1.up)
}
