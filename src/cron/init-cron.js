const cron = require("node-cron")

const { exportPilo } = require("./pilo")
const { initPreSummaryActivity } = require("./init-pre-summary-activity")
const { initSummaryActivity } = require("./init-summary-activity")

exports.initCrons = async () => {
  cron
    .schedule(process.env.PILO_CRON || "0 0 1 * *", () => {
      console.log("Begin export PILO")
      exportPilo()
      console.log("Export PILO finished")
    })
    .start()

    cron
    .schedule(process.env.SUMMARY_CRON || "0 2 1 * *", () => {
      console.log("Begin export summary")
      initPreSummaryActivity().then((knex) => initSummaryActivity(knex))      
      console.log("Export summary finished ")
    })
    .start()
}
