import "@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css"

import * as Sentry from "@sentry/node"
import App from "next/app"
import getConfig from "next/config"
import Head from "next/head"
import React from "react"
import { ThemeProvider } from "styled-components"

import { initMatomo } from "../utils/matomo"

const { publicRuntimeConfig } = getConfig()

const theme = {
  colors: {
    primary: "#0070f3",
  },
}

Sentry.init({
  dsn: publicRuntimeConfig.SENTRY_DSN,
})

export default class MyApp extends App {
  componentDidMount() {
    initMatomo({
      piwikUrl: publicRuntimeConfig.MATOMO_URL,
      siteId: publicRuntimeConfig.MATOMO_SITE_ID,
    })
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>Medlé</title>
        </Head>

        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </>
    )
  }
}
