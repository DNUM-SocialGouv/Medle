exports.seed = function(knex) {
   return knex("attacks").then(function() {
      return knex("attacks").insert([
         {
            id: 1,
            created_at: "2020-01-20 19:55:53.300334",
            name: "Bataclan",
         },
         {
            id: 2,
            created_at: "2020-01-20 19:55:53.300334",
            name: "Hyper Cacher",
         },
      ])
   })
}
