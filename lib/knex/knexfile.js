import { join } from "path"

require("dotenv").config()

const knexConfig = {
   development: {
      client: "pg",
      connection: process.env.DATABASE_URL || {
         host: "127.0.0.1",
         user: "medlexxx",
         password: "medlexxx",
         database: "medlexxx",
         port: "5432",
      },
      pool: { min: 0, max: 7 },
      migrations: {
         directory: join(__dirname, "migrations"),
      },
      seeds: {
         directory: join(__dirname, "seeds/development"),
      },
   },
   production: {
      client: "pg",
      connection: process.env.DATABASE_URL,
      pool: { min: 0, max: 7 },
      migrations: {
         directory: join(__dirname, "migrations"),
      },
   },
}

const environment = process.env.NODE_ENV || "development"

console.log("environment", environment)
console.log("knex[environment]", JSON.stringify(knexConfig[environment]))

export default require("knex")(knexConfig[environment])
