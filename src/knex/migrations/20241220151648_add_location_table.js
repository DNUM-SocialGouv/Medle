
const profiles = ["Victime (vivante)", "Gardé.e à vue", "Personne pour âge osseux (hors GAV)", "Examen pour OFPRA", "Autre activité/Personne retenue", "Autre activité/Examen lié à la route", "Autre activité/IPM"]

const rows = profiles.map((profile) => {
    const repeatedRows = []
    for (let index = 1; index < 4; index++) {
        repeatedRows[index] = {profile, location: `Autre lieu ${index}`}
    }
    return repeatedRows
}).flat();

exports.up = function (knex) {
    return knex.schema.createTable("act_other_location", function (table) {
        table.increments("id")
        table.string("profile", 255)
        table.string("location", 255)
    }).then(function () {
        return knex("act_other_location").insert(rows);
    });
}

exports.down = async function (knex) {
    return knex.schema.dropTable("act_other_location")
}