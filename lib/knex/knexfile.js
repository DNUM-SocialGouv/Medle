//

// const { join } = require("path")

// module.exports = {
//    test: {
//       // debug: true,
//       client: "pg",
//       connection: process.env.DATABASE_URL || {
//          host: "localhost",
//          user: "emjpm",
//          password: "test",
//          port: "5434",
//          database: "emjpm",
//       },
//       migrations: {
//          directory: join(__dirname, "migrations"),
//       },
//       seeds: {
//          directory: join(__dirname, "seeds/development"),
//       },
//    },
//    development: {
//       client: "pg",
//       connection: process.env.DATABASE_URL || {
//          host: "localhost",
//          user: "emjpm",
//          password: "test",
//          port: "5434",
//          database: "emjpm",
//       },
//       migrations: {
//          directory: join(__dirname, "migrations"),
//       },
//       seeds: {
//          directory: join(__dirname, "seeds/development"),
//       },
//    },
//    production: {
//       client: "pg",
//       connection: process.env.DATABASE_URL || {
//          host: "localhost",
//          user: "emjpm",
//          password: "test",
//          port: "5434",
//          database: "emjpm",
//       },
//       migrations: {
//          directory: join(__dirname, "migrations"),
//       },
//    },
// }

const knex = require("knex")({
   client: "pg",
   connection: {
      host: "127.0.0.1",
      user: "medle",
      password: "medle",
      database: "medle",
      port: "5432",
   },
   pool: { min: 0, max: 7 },
})

export default knex
