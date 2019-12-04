exports.seed = function(knex) {
   // Deletes ALL existing entries
   return knex("askers")
      .del()
      .then(function() {
         // Inserts seed entries
         return knex("askers").insert([
            {
               id: 1,
               created_at: knex.fn.now(),
               name: "TGI Angers",
            },
            {
               id: 2,
               created_at: knex.fn.now(),
               name: "TGI de Nantes",
            },
            {
               id: 3,
               created_at: knex.fn.now(),
               name: "TGI de Tours",
            },
            {
               id: 4,
               created_at: knex.fn.now(),
               name: "TGI d'Orléans",
            },
         ])
      })
}
