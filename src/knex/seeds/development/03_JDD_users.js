// NB: all passwords have the content "test" after bcrypt operations. So use medle@tours.fr/test, for example, to authenticate
exports.seed = function(knex) {
   return knex("users")
      .del()
      .then(function() {
         return knex("users").insert([
            {
               id: 1,
               created_at: "2020-01-20 19:55:53.300334",
               first_name: "Admin",
               last_name: "test",
               email: "admin@medle.fr",
               role: "SUPER_ADMIN",
               password: "$2a$10$u3FoG3RQkIR8fZ8ymhl3s.FnmWF9u5h.gGmH0w.45GEfakd2NLv22",
               hospital_id: null,
               scope: null,
            },
            {
               id: 2,
               created_at: "2020-01-20 19:55:53.300334",
               first_name: "Utilisateur de Tours",
               last_name: "Actes",
               email: "acte@tours.fr",
               password: "$2a$10$RCEEeI.gFf1occ6h4DxMyuX.JhVPD3edsevOYnqICcQl5yM1LO4Vy",
               role: "OPERATOR_ACT",
               hospital_id: 1,
               scope: null,
            },
            {
               id: 3,
               created_at: "2020-01-20 19:55:53.300334",
               first_name: "Utilisateur de Tours",
               last_name: "ETP",
               email: "etp@tours.fr",
               password: "$2a$10$RCEEeI.gFf1occ6h4DxMyuX.JhVPD3edsevOYnqICcQl5yM1LO4Vy",
               role: "OPERATOR_EMPLOYMENT",
               hospital_id: 1,
               scope: null,
            },
            {
               id: 4,
               created_at: "2020-01-20 19:55:53.300334",
               first_name: "Utilisateur de Nantes",
               last_name: "Actes",
               email: "acte@nantes.fr",
               password: "$2a$10$R.WS.y7VahtlPikBIhoT0.zEHul4gUDYvAacv3qrNATcQtJhDFQ4G",
               role: "OPERATOR_ACT",
               hospital_id: 3,
               scope: null,
            },
            {
               id: 5,
               created_at: "2020-01-20 19:55:53.300334",
               first_name: "Utilisateur de Tours",
               last_name: "Admin",
               email: "admin@tours.fr",
               password: "$2a$10$R.WS.y7VahtlPikBIhoT0.zEHul4gUDYvAacv3qrNATcQtJhDFQ4G",
               role: "ADMIN_HOSPITAL",
               hospital_id: 1,
               scope: null,
            },
            {
               id: 6,
               created_at: "2020-01-20 19:55:53.300334",
               first_name: "Utilisateur ARS",
               last_name: "Région centre",
               email: "ars@centre.fr",
               password: "$2a$10$R.WS.y7VahtlPikBIhoT0.zEHul4gUDYvAacv3qrNATcQtJhDFQ4G",
               role: "REGIONAL_SUPERVISOR",
               hospital_id: null,
               scope: JSON.stringify([1, 2]),
            },
            {
               id: 7,
               created_at: "2020-01-20 19:55:53.300334",
               first_name: "Utilisateur Ministère",
               last_name: "Ministère de la justice",
               email: "ministere@justice.fr",
               password: "$2a$10$R.WS.y7VahtlPikBIhoT0.zEHul4gUDYvAacv3qrNATcQtJhDFQ4G",
               role: "PUBLIC_SUPERVISOR",
               hospital_id: null,
               scope: null,
            },
            {
               id: 8,
               created_at: "2020-01-20 19:55:53.300334",
               deleted_at: "2020-01-21 19:55:53.300334",
               first_name: "Utilisateur de Tours supprimé",
               last_name: "Actes",
               email: "acte.old@tours.fr",
               password: "$2a$10$RCEEeI.gFf1occ6h4DxMyuX.JhVPD3edsevOYnqICcQl5yM1LO4Vy",
               role: "OPERATOR_ACT",
               hospital_id: 1,
               scope: null,
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
