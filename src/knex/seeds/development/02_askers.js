exports.seed = function(knex) {
   return knex("askers").then(function() {
      return knex("askers").insert([
         {
            id: 1,
            created_at: "2020-01-20 19:55:53.300334",
            name: "TGI Angers",
         },
         {
            id: 2,
            created_at: "2020-01-20 19:55:53.300334",
            name: "TGI de Nantes",
         },
         {
            id: 3,
            created_at: "2020-01-20 19:55:53.300334",
            name: "TGI de Tours",
         },
         {
            id: 4,
            created_at: "2020-01-20 19:55:53.300334",
            name: "TGI d'Orléans",
         },
         {
            id: 5,
            created_at: "2020-01-20 19:55:53.300334",
            name: "Brigade de gendarmerie de Nice",
         },
         {
            id: 6,
            created_at: "2020-01-20 19:55:53.300334",
            name: "Commissariat de Vincennes",
         },
         {
            id: 7,
            created_at: "2020-01-20 19:55:53.300334",
            name: "Brigade de gendarmerie de Blois",
         },
         {
            id: 8,
            created_at: "2020-01-20 19:55:53.300334",
            name: "OFPRA",
         },
      ])
   })
}
