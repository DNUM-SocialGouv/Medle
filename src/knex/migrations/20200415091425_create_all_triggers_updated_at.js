const triggerUp = table => `
    create trigger updated_at_auto before update on ${table}
    for each row execute procedure updated_at_auto();
`

const triggerDown = table => `
    drop trigger if exists updated_at_auto on ${table};
`

exports.up = async function(knex) {
   await knex.raw(triggerUp("askers"))
   await knex.raw(triggerUp("attacks"))
   await knex.raw(triggerUp("employments"))
   await knex.raw(triggerUp("hospitals"))
   await knex.raw(triggerUp("users"))
}

exports.down = async function(knex) {
   await knex.raw(triggerDown("askers"))
   await knex.raw(triggerDown("attacks"))
   await knex.raw(triggerDown("employments"))
   await knex.raw(triggerDown("hospitals"))
   await knex.raw(triggerDown("users"))
}
