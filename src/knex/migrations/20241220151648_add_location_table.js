exports.up = function (knex) {
    return knex.schema.createTable("act_other_location", function (table) {
        table.increments("id")
        table.string("profile", 255)
        table.string("location", 255)
    })
}

exports.down = async function (knex) {
    return knex.schema.dropTable("act_other_location")
}