const { join } = require("path")

console.info("process.env.DATABASE_URL", process.env.DATABASE_URL)

if (process.env.POSTGRES_SSL && process.env.POSTGRES_SSL === "true") {
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
