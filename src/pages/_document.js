import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script src="/polyfill.js" />
          <script type="text/javascript" src="/tarteaucitron/tarteaucitron.js"></script>
          <script type="text/javascript" src="/tarteaucitron/initTarteaucitron.js"></script>
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
