const cron = require("node-cron")

const { exportPilo } = require("./pilo")
const { initPreSummaryActivity } = require("./init-pre-summary-activity")
const { initSummaryActivity } = require("./init-summary-activity")
const { etpNotif } = require("./etp-notif")
const { purgeDeletedUsers } = require("./purge-users")

exports.initCrons = async () => {
  const piloCronExpression = process.env.PILO_CRON || "0 0 1 * *";
  const etpCronExpression = process.env.ETP_NOTIF_CRON || "0 0 1 6,12 *";
  const summaryCronExpression = process.env.SUMMARY_CRON || "0 2 1 * *";
  const purgeUsersCronExpression = process.env.USERS_PURGE_CRON || "0 3 1 * *";

  console.log("Lancement des CRON");
  console.log(`Cron pilo configuré avec les valeurs ${piloCronExpression}`);
  console.log(`Cron ETP configuré avec les valeurs ${etpCronExpression}`);
  console.log(`Cron summary configuré avec les valeurs ${summaryCronExpression}`);
  console.log(`Cron purge users configuré avec les valeurs ${purgeUsersCronExpression}`);

  cron
    .schedule(piloCronExpression, () => {
      console.log("Begin export PILO")
      exportPilo()
      console.log("Export PILO finished ")
    })
    .start()

  cron
    .schedule(etpCronExpression, () => {
      console.log("Begin cron etp")
      etpNotif()
      console.log("Cron etp finished")
    })
    .start()

  cron
    .schedule(summaryCronExpression, () => {
      console.log("Begin SUMMARY CRON")
      initPreSummaryActivity().then((knex) => initSummaryActivity(knex))
      console.log("Export SUMMARY finished")
    })
    .start()

  cron
    .schedule(purgeUsersCronExpression, () => {
      console.log("Begin purge users")
      purgeDeletedUsers()
      console.log("Purge users finished")
    })
    .start()
  console.log("Fin de lancement des CRON");
}
