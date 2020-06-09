const view_v3 = require("../versions/views/acts_by_day/v3")
const view_v4 = require("../versions/views/acts_by_day/v4")

exports.up = async function (knex) {
  await knex.raw(view_v3.down)
  await knex.raw(view_v4.up)
}

exports.down = async function (knex) {
  await knex.raw(view_v4.down)
  await knex.raw(view_v3.up)
}
