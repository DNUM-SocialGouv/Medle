const cron = require("node-cron")

const { exportPilo } = require("./pilo")
const { initPreSummaryActivity } = require("./init-pre-summary-activity")
const { initSummaryActivity } = require("./init-summary-activity")

exports.initCrons = async () => {
  cron
    .schedule(process.env.PILO_CRON || "0 0 1 * *", () => {
      console.log("Begin export")
      exportPilo()
      console.log("Export finished")
    })
    .start()
   initPreSummaryActivity().then(() => initSummaryActivity())
  // cron
  //   .schedule(process.env.PILO_CRON || "0 0 1 * *", () => {
  //     console.log("Begin export")
  //     initPreSummaryActivity().then(() => initSummaryActivity())
  //     console.log("Export finished")
  //   })
  //   .start()
  // initSummaryActivityy();
}
