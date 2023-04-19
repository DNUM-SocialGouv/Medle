const knexConfig = require("../../knexfile")

const environment = process.env.NODE_ENV || "development"

const knex = require("knex")(knexConfig[environment])

const { appendFileSync } = require("node:fs")

const stringifyValue = (value) => {
  if (typeof value === "object") return JSON.stringify(value).replaceAll('"', "'")
  if (typeof value === "string") return value.replaceAll('"', '""')
  return value
}
function queryBuilder(table, startDate) {
  let query = knex(table)

  if (startDate) {
    query = query.where("created_at", ">=", startDate)
  }
  return query
}

exports.exportPilo = async () => {
  try {
    const tables = ["acts", "askers", "attacks", "employments", "hospitals"]
    const currentDate = new Date().toISOString().split("T")[0]

    const [dateParam] = await knex("exportParams").where("name", "last_date").select("*")

    const startDate = dateParam.value && new Date(dateParam.value)
    const endDate = new Date(currentDate)

    const queries = tables.map(async (table) => {
      const tableData = await queryBuilder(table, startDate).where("created_at", "<=", endDate).select("*")
      const [{ value: csvHeader }] = await knex("exportParams").where("name", `${table}_fields`).select("*")
      const csvBody = tableData.map((data) => csvHeader.map((header) => stringifyValue(data[header])))
      const csvData = [csvHeader, ...csvBody]

      const csv = csvData
        .map((row) =>
          row
            .map(String)
            .map((v) => `"${v}"`)
            .join(","),
        )
        .join("\r\n")

      appendFileSync(`./exports/${currentDate}_${table}_export.csv`, csv)
    })

    await Promise.all(queries)

    await knex("exportParams")
      .where("name", "last_date")
      .update({ value: [currentDate] })
  } catch (e) {
    console.error("Error Prisma Crons Pilo :", e)
  }
}
