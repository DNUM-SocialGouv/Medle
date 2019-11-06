require("dotenv").config()

console.log("process.env.NODE_ENV", process.env.NODE_ENV)
console.log("Database URL", process.env.DATABASE_URL)

const { join } = require("path")

const knexConfig = {
   development: {
      client: "pg",
      connection: process.env.DATABASE_URL || {
         host: "127.0.0.1",
         user: "medlexxx", //host.docker.internal
         password: "medlexxx",
         database: "medlexxx",
         port: "5432",
      },
      pool: { min: 0, max: 7 },
      migrations: {
         directory: join(__dirname, "lib/knex/migrations"),
      },
      seeds: {
         directory: join(__dirname, "lib/knex/seeds/development"),
      },
   },
   staging: {
      client: "pg",
      connection: process.env.DATABASE_URL,
      pool: { min: 0, max: 7 },
      migrations: {
         directory: join(__dirname, "lib/knex/migrations"),
      },
      seeds: {
         directory: join(__dirname, "lib/knex/seeds/staging"),
      },
   },
   production: {
      client: "pg",
      connection: process.env.DATABASE_URL,
      pool: { min: 0, max: 7 },
      migrations: {
         directory: join(__dirname, "lib/knex/migrations"),
      },
   },
}

module.exports = knexConfig
