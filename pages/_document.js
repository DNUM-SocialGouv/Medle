import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"

class MyDocument extends Document {
   static async getInitialProps(ctx) {
      const initialProps = await Document.getInitialProps(ctx)
      return { ...initialProps }
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
