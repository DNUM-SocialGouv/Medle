const cron = require("node-cron")

const { exportPilo } = require("./pilo")
const { initPreSummaryActivity } = require("./init-pre-summary-activity")
const { initSummaryActivity } = require("./init-summary-activity")
const { etpNotif } = require("./etp-notif")

exports.initCrons = async () => {
  cron
    .schedule(process.env.PILO_CRON || "0 0 1 * *", () => {
      console.log("Begin export")
      exportPilo()
      console.log("Export finished")
    })
    .start()

    // cron
    // .schedule(process.env.ETP_NOTIF_CRON || "0 0 1 6,12 *", () => {
    //   console.log("Begin export")
      etpNotif()
    //   console.log("Export finished")
    // })
    // .start()

    cron
    .schedule(process.env.SUMMARY_CRON || "0 2 1 * *", () => {
      console.log("Begin export")
      initPreSummaryActivity().then(() => initSummaryActivity())      
      console.log("Export finished")
    })
    .start()
}
