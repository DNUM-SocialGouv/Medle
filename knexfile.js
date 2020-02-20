require("dotenv").config()

console.log("process.env.NODE_ENV", process.env.NODE_ENV)
console.log("Database URL", process.env.DATABASE_URL)

const { join } = require("path")

if (process.env.POSTGRES_SSL) {
   console.log("Knex Postgres with SSL")
   const pg = require("pg")
   pg.defaults.ssl = true
}

const knexConfig = {
   development: {
      client: "pg",
      connection: process.env.DATABASE_URL,
      pool: {
         min: 0,
         max: 15,
         afterCreate: function(connection, callback) {
            connection.query("SET timezone = 'Europe/Paris';", function(err) {
               callback(err, connection)
            })
         },
      },
      migrations: {
         directory: join(__dirname, "src/knex/migrations"),
      },
      seeds: {
         directory: join(__dirname, "src/knex/seeds/development"),
      },
   },
   staging: {
      client: "pg",
      connection: process.env.DATABASE_URL,
      pool: {
         min: 0,
         max: 15,
         afterCreate: function(connection, callback) {
            connection.query("SET timezone = 'Europe/Paris';", function(err) {
               callback(err, connection)
            })
         },
      },
      migrations: {
         directory: join(__dirname, "src/knex/migrations"),
      },
      seeds: {
         directory: join(__dirname, "src/knex/seeds/staging"),
      },
   },
   production: {
      client: "pg",
      connection: process.env.DATABASE_URL,
      pool: {
         min: 0,
         max: 15,
         afterCreate: function(connection, callback) {
            connection.query("SET timezone = 'Europe/Paris';", function(err) {
               callback(err, connection)
            })
         },
      },
      migrations: {
         directory: join(__dirname, "src/knex/migrations"),
      },
   },
}

module.exports = knexConfig
