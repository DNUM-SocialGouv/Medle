exports.seed = function (knex) {
  return knex("attacks").then(function () {
    return knex("attacks").insert([
      {
        id: 1,
        name: "Bataclan",
      },
      {
        id: 2,
        name: "Hyper Cacher",
      },
    ])
  })
}
