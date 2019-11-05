const knexConfig = require("../../knexfile")

const environment = process.env.NODE_ENV || "development"

console.log("process.env.NODE_ENV", process.env.NODE_ENV)
console.log("knexConfig", knexConfig[environment])

export default require("knex")(knexConfig[environment])
