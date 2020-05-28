exports.seed = function (knex) {
  return knex("attacks")
    .then(function () {
      return knex("attacks").insert([
        {
          id: 1,
          name: "2015 Bataclan",
        },
        {
          id: 2,
          name: "2015 Hyper Cacher",
        },
        {
          id: 3,
          name: "2015 Les terrasses Paris",
        },
        {
          id: 4,
          name: "2016 Nice",
        },
        {
          id: 5,
          name: "2020 Villejuif",
        },
        {
          id: 6,
          name: "2012 École Ozar Hatorah Toulouse",
        },
        {
          id: 7,
          name: "2015 Charlie Hebdo",
        },
      ])
    })
    .then(function () {
      return knex.raw(
        "select pg_catalog.setval(pg_get_serial_sequence('attacks', 'id'), (select max(id) from attacks) + 1);"
      )
    })
}
