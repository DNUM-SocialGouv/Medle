import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"
import { ServerStyleSheet } from "styled-components"
import "core-js/stable"

class MyDocument extends Document {
   static async getInitialProps(ctx) {
      const sheet = new ServerStyleSheet()
      const originalRenderPage = ctx.renderPage

      try {
         ctx.renderPage = () =>
            originalRenderPage({
               enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
            })

         const initialProps = await Document.getInitialProps(ctx)
         return {
            ...initialProps,
            styles: (
               <>
                  {initialProps.styles}
                  {sheet.getStyleElement()}
               </>
            ),
         }
      } finally {
         sheet.seal()
      }
   }

   render() {
      return (
         <Html>
            <Head>
               <link
                  rel="stylesheet"
                  href="https://socialgouv.github.io/bootstrap/master/@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css"
               />
            </Head>
            <body>
               <Main />
               <NextScript />
            </body>
         </Html>
      )
   }
}

export default MyDocument
