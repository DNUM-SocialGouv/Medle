import App from "next/app"
import React from "react"
import { ThemeProvider } from "styled-components"
import { initMatomo } from "../utils/matomo"
import * as Sentry from "@sentry/node"

import "@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css"

const theme = {
   colors: {
      primary: "#0070f3",
   },
}

console.log("SENTRY DSN", process.env.SENTRY_DSN)
console.log("MATOMO_SITE_ID", process.env.MATOMO_SITE_ID)

Sentry.init({
   dsn: process.env.SENTRY_DSN,
})

export default class MyApp extends App {
   componentDidMount() {
      initMatomo({
         siteId: process.env.MATOMO_SITE_ID,
         piwikUrl: process.env.MATOMO_URL,
      })

      console.log("process.env.NODE_ENV", process.env.NODE_ENV)
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
