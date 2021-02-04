import Document, { Head, Html, Main, NextScript } from "next/document"
import React from "react"

class MyDocument extends Document {
  render() {
    return (
      <Html lang="fr">
        <Head>
          <script src="/polyfill.js" />
          <script type="text/javascript" src="/tarteaucitron/tarteaucitron.js" />
          <script type="text/javascript" src="/tarteaucitron/initTarteaucitron.js" />
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
