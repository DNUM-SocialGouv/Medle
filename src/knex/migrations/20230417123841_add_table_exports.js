/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("exportParams", function (table) {
        table.string("name").primary().notNullable().unique()
        table.specificType("value", "text[]")
    })
        .then(() => {
            return knex('exportParams').insert({ name: "last_date", value: null });
        })
        .then(() => {
            const tableNames = ["acts", "askers", "attacks", "employments", "hospitals"]
            const columnPromises = tableNames.map((tableName) => knex(tableName).columnInfo());

            knex('exportParams').insert({ name: "createdAt", value: null });

            return Promise.all(columnPromises).then((columnInfos) => {
                const dataArray = [];
                columnInfos.forEach((columnInfo, index) => {
                    const columnNamesArray = Object.keys(columnInfo);
                    const data = {
                        name: `${tableNames[index]}_fields`,
                        value: columnNamesArray
                    }
                    dataArray.push(data);
                });

                return knex('exportParams').insert(dataArray);
            });
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("exportParams")
}
