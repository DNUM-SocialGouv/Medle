import "@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css"

import * as Sentry from "@sentry/node"
import App from "next/app"
import Head from "next/head"
import React from "react"
import { ThemeProvider } from "styled-components"

import { initMatomo } from "../utils/matomo"

const theme = {
  colors: {
    primary: "#0070f3",
  },
}

/*
Sentry.init({
  dsn: process.env.SENTRY_DSN,
})
*/

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
          <title>Medlé</title>
        </Head>

        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </>
    )
  }
}
