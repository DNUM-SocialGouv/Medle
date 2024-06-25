const fs = require("fs")
const path = require("path")
const archiver = require("archiver")
const knexConfig = require("../../knexfile")

const environment = process.env.NODE_ENV || "development"

const knex = require("knex")(knexConfig[environment])

const stringifyValue = (value) => {
  if (typeof value === "object" && !(value instanceof Date)) return JSON.stringify(value)
  if (value instanceof Date) return new Date(value).toISOString()
  return value
}

function queryBuilder(table, startDate) {
  let query = knex(table)

  if (startDate) {
    query = query.where(function() {
      this.where("created_at", ">=", startDate)
      .orWhere("updated_at", ">=", startDate)
    })
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
    const dirPath = "./exports"
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
    const promises = tables.map(async (table) => {
      const tableData = await queryBuilder(table, startDate)
      .where(function() {
        this.where("created_at", "<=", endDate)
        .orWhere("updated_at", "<=", endDate)
      }).select("*")

      const [{ value: csvHeader }] = await knex("exportParams").where("name", `${table}_fields`).select("*")
      const csvBody = tableData.map((data) => csvHeader.map((header) => stringifyValue(data[header])))
      const csvData = [csvHeader, ...csvBody]

      const csv = csvData.map((row) => row.map(String).join("|")).join("\r\n")

      const filePath = `./exports/${currentDate}_${table}_export.csv`
      fs.writeFileSync(filePath, csv)
      return filePath
    })

    const filepaths = await Promise.all(promises)

    const zipFileName = `PILO360_MEDLE_${currentDate}.gz`
    const zipFilePath = `./exports/${zipFileName}`

    if (fs.existsSync(zipFilePath)) {
      fs.unlinkSync(zipFilePath)
    }

    const output = fs.createWriteStream(`./exports/${zipFileName}`)
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    })

    output.on("close", () => {
      console.log(`Successfully compressed to ${zipFileName}`)
      // delete csv files
      filepaths.forEach((filePath) => {
        fs.unlinkSync(filePath)
      })
    })

    archive.on("warning", (err) => {
      if (err.code === "ENOENT") {
        console.warn(err)
      } else {
        throw err
      }
    })

    archive.on("error", (err) => {
      throw err
    })

    archive.pipe(output)

    filepaths.forEach((filePath) => {
      const fileName = path.basename(filePath)
      archive.file(filePath, { name: fileName })
    })

    archive.finalize()

    await knex("exportParams")
      .where("name", "last_date")
      .update({ value: [currentDate] })
  } catch (e) {
    console.error("Error Prisma Crons Pilo :", e)
  }
}
