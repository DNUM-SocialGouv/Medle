const cron = require("node-cron")

const { exportPilo } = require("./pilo")
const { initPreSummaryActivity } = require("./init-pre-summary-activity")
const { initSummaryActivity } = require("./init-summary-activity")
const { etpNotif } = require("./etp-notif")

exports.initCrons = async () => {
  cron
    .schedule(process.env.PILO_CRON || "0 0 1 * *", () => {
      console.log("Begin export PILO")
      exportPilo()
      console.log("Export PILO finished ")
    })
    .start()

    cron
    .schedule(process.env.ETP_NOTIF_CRON || "0 0 1 6,12 *", () => {
      console.log("Begin cron etp")
      etpNotif()
      console.log("Cron etp finished")
    })
    .start()

    cron
    .schedule(process.env.SUMMARY_CRON || "0 2 1 * *", () => {
      console.log("Begin SUMMARY CRON")
      initPreSummaryActivity().then((knex) => initSummaryActivity(knex))      
      console.log("Export SUMMARY finished")
    })
    .start()
}
