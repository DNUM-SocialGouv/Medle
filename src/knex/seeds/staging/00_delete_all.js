exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("employments")
    .del()
    .then(() => knex("acts").del())
    .then(() => knex("users").del())
    .then(() => knex("hospitals").del())
    .then(() => knex("askers").del())
    .then(() => knex("attacks").del())
    .then(() => knex("messages").del())
}
