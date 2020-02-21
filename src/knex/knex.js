import { logInfo } from "../utils/logger"

const knexConfig = require("../../knexfile")

const environment = process.env.NODE_ENV || "development"

logInfo("knexConfig", knexConfig[environment])

export default require("knex")(knexConfig[environment])
