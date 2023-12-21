
exports.up = function (knex) {
    return knex.schema.alterTable("act_pre_summary", function (table) {
        table.float('act_duration').alter();

    })
  }
  
  exports.down = async function (knex) {
      return knex.schema.alterTable('act_pre_summary', (table) => {
        table.integer('act_duration').alter();
    })
}