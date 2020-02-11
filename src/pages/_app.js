import App from "next/app"
import React from "react"
import { ThemeProvider } from "styled-components"
import { initMatomo } from "../utils/matomo"

import "../style.css" // hack/workaround to accept CSS module in Next... see https://github.com/zeit/next.js/issues/5264#issuecomment-424000127

const theme = {
   colors: {
      primary: "#0070f3",
   },
}

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
