import knex from "../../knex/knex"

export const find = async () => {

  const locations = await knex("act_other_location")
    .select([
      "act_other_location.*",
    ])

  return locations;
}
