exports.seed = function (knex) {
  return knex("attacks")
    .then(function () {
      return knex("attacks").insert([
        {
          id: 1,
          name: "Bataclan 2015",
        },
        {
          id: 2,
          name: "Hyper Cacher 2015",
        },
        {
          id: 3,
          name: "Les terrasses Paris 2015",
        },
        {
          id: 4,
          name: "Nice 2016",
        },
        {
          id: 5,
          name: "Villejuif 2020",
        },
        {
          id: 6,
          name: "École Ozar Hatorah Toulouse 2012",
        },
        {
          id: 7,
          name: "Charlie Hebdo 2015",
        },
      ])
    })
    .then(function () {
      return knex.raw(
        "select pg_catalog.setval(pg_get_serial_sequence('attacks', 'id'), (select max(id) from attacks) + 1);"
      )
    })
}
