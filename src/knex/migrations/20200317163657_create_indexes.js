exports.up = async function (knex) {
  await knex.raw("create index acts_extra_data_idx on acts using gin (extra_data JSONB_PATH_OPS);")
  await knex.raw("create index acts_added_by_idx on acts (added_by);")
  await knex.raw("create index acts_asker_id_idx on acts (asker_id);")
  await knex.raw("create index acts_hospital_id_idx on acts (hospital_id);")
  await knex.raw("create index users_hospital_id_idx on users (hospital_id);")
}

exports.down = async function (knex) {
  await knex.raw("drop index acts_extra_data_idx;")
  await knex.raw("drop index acts_added_by_idx;")
  await knex.raw("drop index acts_asker_id_idx;")
  await knex.raw("drop index acts_hospital_id_idx;")
  await knex.raw("drop index users_hospital_id_idx;")
}
