import knex from "../../knex/knex"

const getLastUpdate = async () => {
    const [res] = await knex("act_summary_last_update").where({name: "last_update"})
    return res;
  }

export default getLastUpdate;