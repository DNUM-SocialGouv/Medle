exports.seed = function(knex) {
   // Deletes ALL existing entries
   return knex("users")
      .del()
      .then(function() {
         // Inserts seed entries
         return knex("users").insert([
            {
               id: 1,
               created_at: knex.fn.now(),
               first_name: "medle",
               last_name: "test",
               email: "medle.test@beta.gouv.fr",
               password: "test",
            },
         ])
      })
}

// table.increments("id")
// table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
// table.timestamp("updated_at", { useTz: true })
// table.timestamp("deleted_at", { useTz: true })
// table.string("first_name", 255)
// table.string("last_name", 255)
// table.string("email", 255).notNullable()
// table.string("password", 255).notNullable()
// table.string("profile", 50)
