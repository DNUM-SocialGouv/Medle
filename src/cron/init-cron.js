const cron = require("node-cron")
const { exportPilo } = require("./pilo")

exports.initCrons = () => {
  cron
    .schedule(process.env.PILO_CRON || "0 0 1 * *", () => {
      console.log("Begin export")
      exportPilo()
      console.log("Export finished")
    })
    .start()
}
