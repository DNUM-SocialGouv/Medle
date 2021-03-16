import "@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css"

import * as Sentry from "@sentry/node"
import App from "next/app"
import getConfig from "next/config"
import Head from "next/head"
import React from "react"
import { ThemeProvider } from "styled-components"

import { logInfo } from "../utils/logger"
import { initMatomo } from "../utils/matomo"

const { publicRuntimeConfig } = getConfig()

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

logInfo("POSTGRES_SSL", process.env.POSTGRES_SSL)
logInfo("DATABASE_URL", process.env.DATABASE_URL)

logInfo("-----------------------------------------")

Sentry.init({
  dsn: process.env.SENTRY_DSN,
})

export default class MyApp extends App {
  componentDidMount() {
    initMatomo({
      piwikUrl: process.env.MATOMO_URL,
      siteId: process.env.MATOMO_SITE_ID,
    })
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>Médlé</title>
        </Head>

        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </>
    )
  }
}
