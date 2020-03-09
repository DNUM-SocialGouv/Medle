// this view will be the only one to survive (because it contains all the data needed)
const generic_view_v1 = require("../versions/views/acts_by_day/v1")
const generic_view_v2 = require("../versions/views/acts_by_day/v2")
// this view is not useful anymore
const living_view_v1 = require("../versions/views/living_acts_by_day/v1")

exports.up = async function(knex) {
   await knex.raw(living_view_v1.down)
   await knex.raw(generic_view_v1.down)
   await knex.raw(generic_view_v2.up)
}

exports.down = async function(knex) {
   await knex.raw(generic_view_v2.down)
   await knex.raw(generic_view_v1.up)
   await knex.raw(living_view_v1.up)
}
