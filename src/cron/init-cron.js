const cron = require("node-cron")

const { exportPilo } = require("./pilo")
const { initPreSummaryActivity } = require("./init-pre-summary-activity")
const { initSummaryActivity } = require("./init-summary-activity")

exports.initCrons = async () => {
  cron
    .schedule(process.env.PILO_CRON || "0 0 1 * *", () => {
      console.log("Begin cron pilo ")
      exportPilo()
      console.log("Cron pilo finished")
    })
    .start()

    cron
    .schedule(process.env.ETP_NOTIF_CRON || "0 0 1 6,12 *", () => {
      console.log("Begin cron etp notif")
      etpNotif()
      console.log("Cron etp notif finished")
    })
    .start()

    cron
    .schedule(process.env.SUMMARY_CRON || "0 2 1 * *", () => {
      console.log("Begin cron summary")
      initPreSummaryActivity().then((knex) => initSummaryActivity(knex))      
      console.log("Cron summary finished")
    })
    .start()
}
