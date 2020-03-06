// NB: all passwords have the content "test" after bcrypt operations. So use medle@tours.fr/test, for example, to authenticate
exports.seed = function(knex) {
   return knex("users")
      .del()
      .then(function() {
         return knex("users").insert([
            {
               id: 1,
               created_at: knex.fn.now(),
               first_name: "Admin",
               last_name: "test",
               email: "medle.test@beta.gouv.fr",
               role: "SUPER_ADMIN",
               password: "$2a$10$RCEEeI.gFf1occ6h4DxMyuX.JhVPD3edsevOYnqICcQl5yM1LO4Vy",
            },
            {
               id: 2,
               created_at: knex.fn.now(),
               first_name: "user-tours",
               last_name: "test",
               email: "medle@tours.fr",
               password: "$2a$10$RCEEeI.gFf1occ6h4DxMyuX.JhVPD3edsevOYnqICcQl5yM1LO4Vy",
               role: "OPERATOR_ACT",
               hospital_id: 1,
            },
            {
               id: 3,
               created_at: knex.fn.now(),
               first_name: "user-orleans",
               last_name: "test",
               email: "medle@orleans.fr",
               password: "$2a$10$RCEEeI.gFf1occ6h4DxMyuX.JhVPD3edsevOYnqICcQl5yM1LO4Vy",
               role: "OPERATOR_ACT",
               hospital_id: 2,
            },
            {
               id: 4,
               created_at: knex.fn.now(),
               first_name: "user-nantes",
               last_name: "test",
               email: "medle@nantes.fr",
               password: "$2a$10$RCEEeI.gFf1occ6h4DxMyuX.JhVPD3edsevOYnqICcQl5yM1LO4Vy",
               role: "OPERATOR_ACT",
               hospital_id: 3,
            },
            {
               id: 5,
               created_at: knex.fn.now(),
               first_name: "user-angers",
               last_name: "test",
               email: "medle@angers.fr",
               password: "$2a$10$RCEEeI.gFf1occ6h4DxMyuX.JhVPD3edsevOYnqICcQl5yM1LO4Vy",
               role: "OPERATOR_ACT",
               hospital_id: 4,
            },
            {
               id: 6,
               created_at: knex.fn.now(),
               first_name: "acte-tours",
               last_name: "test",
               email: "acte@tours.fr",
               password: "$2a$10$RCEEeI.gFf1occ6h4DxMyuX.JhVPD3edsevOYnqICcQl5yM1LO4Vy",
               role: "OPERATOR_ACT",
               hospital_id: 1,
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
// table.string("role", 50)
