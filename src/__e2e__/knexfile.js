// custom knexfile to ensure to use a test db
const { join } = require("path")

// WIP : how to manage a database, to reset and call an API endpoint in sync with the DB?
if (!process.env.E2E_JEST_DATABASE_URL) {
  throw Error("No configured database for e2e tests. For production environement, please don't run e2e tests")
}

const knexConfig = {
  client: "pg",
  connection: process.env.E2E_JEST_DATABASE_URL,
  pool: {
    min: 0,
    max: 2,
  },
  migrations: {
    directory: join(__dirname, "../knex/migrations"),
  },
  seeds: {
    directory: join(__dirname, "../knex/seeds/development"),
  },
}

module.exports = knexConfig
