exports.up = function (knex) {
    return knex.schema.table("users", function (table) {
        table.dropUnique("email")
        table.unique(["email", "deleted_at"])
    })
}

exports.down = function (knex) {
    return knex.schema.table("users", function (table) {
        table.unique("email")
        table.dropUnique(["email", "deleted_at"])
    })
}
