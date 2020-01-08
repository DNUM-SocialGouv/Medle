import App from "next/app"
import React from "react"
import { ThemeProvider } from "styled-components"

import "../style.css" // hack/workaround to accept CSS module in Next... see https://github.com/zeit/next.js/issues/5264#issuecomment-424000127

const theme = {
   colors: {
      primary: "#0070f3",
   },
}

export default class MyApp extends App {
   static async getInitialProps(app) {
      if (app.ctx && app.ctx.req) {
         console.log("cookie", app.ctx.req.headers.cookie)
      }
      return {}
   }

   render() {
      const { Component, pageProps } = this.props
      console.log("dans render de _app")
      return (
         <ThemeProvider theme={theme}>
            <Component {...pageProps} />
         </ThemeProvider>
      )
   }
}
