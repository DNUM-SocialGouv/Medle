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

    try {
      initPreSummaryActivity().then(() => initSummaryActivity())      
    } catch (error) {
      console.log('Error', error)
    }
}
