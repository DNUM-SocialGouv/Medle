import App from "next/app"
import React from "react"
import { ThemeProvider } from "styled-components"
import { initMatomo } from "../utils/matomo"
import * as Sentry from "@sentry/node"
import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()

import { logInfo } from "../utils/logger"

import "@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css"

const theme = {
   colors: {
      primary: "#0070f3",
   },
}

logInfo("----------- MEDLE configuration --------")

logInfo("NODE_ENV", process.env.NODE_ENV)
logInfo("DEBUG_MODE", publicRuntimeConfig.DEBUG_MODE)

logInfo("SENTRY_DSN", process.env.SENTRY_DSN)
logInfo("MATOMO_SITE_ID", process.env.MATOMO_SITE_ID)
logInfo("MATOMO_URL", process.env.MATOMO_URL)

logInfo("API_URL", publicRuntimeConfig.API_URL)
logInfo("TEST_CURRENT_DATE", publicRuntimeConfig.TEST_CURRENT_DATE)

logInfo("POSTGRES_SSL", publicRuntimeConfig.POSTGRES_SSL)
logInfo("DATABASE_URL", process.env.DATABASE_URL)

logInfo("-----------------------------------------")

Sentry.init({
   dsn: process.env.SENTRY_DSN,
})

export default class MyApp extends App {
   componentDidMount() {
      initMatomo({
         siteId: process.env.MATOMO_SITE_ID,
         piwikUrl: process.env.MATOMO_URL,
      })
   }

   render() {
      const { Component, pageProps } = this.props
      return (
         <ThemeProvider theme={theme}>
            <Component {...pageProps} />
         </ThemeProvider>
      )
   }
}
