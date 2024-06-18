
exports.up = function (knex) {
    return knex.schema.createTable("act_summary_last_update", function (table) {
        table.string("name", 255)
        table.string("value", 255)
    }).then(function () {
        return knex("act_summary_last_update").insert({
            name: "last_update",
            value: ""
        });
    });
}

exports.down = async function (knex) {
    return knex.schema.dropTable("act_summary_last_update")
}