require("dotenv").config()

const next = require("next")
const express = require("express")

const crons = require("../src/crons/crons")
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
      console.debug(`process.env.PORT: ${port}`)
      console.debug(`process.env.NEXT_PUBLIC_SENTRY_DSN: ${process.env.NEXT_PUBLIC_SENTRY_DSN}`)
      console.debug(`process.env.NEXT_PUBLIC_SENTRY_TOKEN: ${process.env.NEXT_PUBLIC_SENTRY_TOKEN}`)
      console.debug(`process.env.NEXT_PUBLIC_MATOMO_URL: ${process.env.NEXT_PUBLIC_MATOMO_URL}`)
      console.debug(`process.env.NEXT_PUBLIC_MATOMO_SITE_ID: ${process.env.NEXT_PUBLIC_MATOMO_SITE_ID}`)
      // console.debug(`process.env.POSTGRES_SSL: ${process.env.POSTGRES_SSL}`)
      console.debug(`process.env.DATABASE_URL: ${process.env.DATABASE_URL}`)
      console.debug(`process.env.TEST_CURRENT_DATE: ${process.env.TEST_CURRENT_DATE}`)
      // eslint-disable-next-line no-console
      console.debug(`> Ready on http://localhost:${port}`)
      console.debug("-----------------")
    })
})
