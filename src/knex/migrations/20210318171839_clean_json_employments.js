// For historic reasons, the data_month in employments table were at start as string, with commas or points.
const cleanAndNumberify = (input) => {
  if (typeof input === "string") input = input.replace(",", ".")
  return isNaN(input) ? null : Number(input)
}

exports.up = async function (knex) {
  const rows = await knex("employments").select("id", "data_month")

  rows.forEach(async (row) => {
    // if data_month is already an object, nothing to do
    if (typeof row.data_month === "string") {
      const dataMonth = JSON.parse(row.data_month)
      Object.keys(dataMonth).forEach((key) => (dataMonth[key] = cleanAndNumberify(dataMonth[key])))

      try {
        await knex("employments")
          .where("id", row.id)
          .update({ data_month: JSON.stringify(dataMonth) })
      } catch (error) {
        console.log(`Error for row.id ${row.id}`, error)
      }
    }
  })

  return Promise.resolve("Fin de la mise à jour des données.")
}

exports.down = function (knex) {
  return Promise.resolve("Nothing to do.")
}
