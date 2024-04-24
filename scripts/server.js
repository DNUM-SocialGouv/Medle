require("dotenv").config()

const next = require("next")
const express = require("express")

const crons = require("../src/cron/init-cron")
const pack = require("../package.json")

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== "production"

const app = next({ dev })
const handler = app.getRequestHandler()

const faultyRoute = () => {
  throw new Error("Server exception")
}

app.prepare().then(() => {
  crons.initCrons()
  express()
    .disable("x-powered-by")
    // demo server-exception
    .get("/page-error", faultyRoute)
    // Regular next.js request handler
    .use(handler)
    // This handles errors if they are thrown before reaching the app
    .listen(port, (err) => {
      if (err) {
        throw err
      }
      console.debug("Debug -----------")
      console.debug("Run time variables (cf. index pour les build time variables)")
      console.debug(`NODE_ENV: ${process.env.NODE_ENV}`)
      console.debug(`Package ${pack.name}: ${pack.version}`)
      console.debug(`process.env.PILO_CRON: ${process.env.PILO_CRON}`)
      console.debug(`process.env.SUMMARY_CRON: ${process.env.SUMMARY_CRON}`)
      console.debug(`process.env.ETP_NOTIF_CRON: ${process.env.ETP_NOTIF_CRON}`)
      console.debug(`process.env.DATABASE_URL: ${process.env.DATABASE_URL}`)
      console.debug(`process.env.TEST_CURRENT_DATE: ${process.env.TEST_CURRENT_DATE}`)
      // eslint-disable-next-line no-console
      console.debug(`> Ready on http://localhost:${port}`)
      console.debug("-----------------")
    })
})
