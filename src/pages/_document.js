import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"

class MyDocument extends Document {
   render() {
      return (
         <Html>
            <Head>
               <script src="//polyfill.incubateur.social.gouv.fr/v3/polyfill.min.js?features=default%2CArray.prototype.includes%2CArray.prototype.find%2CArray.prototype.findIndex%2CObject.setPrototypeOf%2CObject.values%2CNumber.isFinite%2CSymbol%2CSymbol.hasInstance%2CSymbol.isConcatSpreadable%2CSymbol.iterator%2CSymbol.unscopables%2CSymbol.toStringTag%2CSymbol.toPrimitive%2CSymbol.split%2CSymbol.search%2CSymbol.species%2CSymbol.replace%2CSymbol.match%2CSet%2CMap%2CWeakMap" />
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
