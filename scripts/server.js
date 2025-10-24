require("dotenv").config()

const crons = require("../src/cron/init-cron")

crons.initCrons();
