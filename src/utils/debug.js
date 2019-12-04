import React, { useEffect } from "react"
import Router from "next/router"

Router.events.on("routeChangeStart", url => {
   console.log("event routeChangeStart", url)
})
Router.events.on("routeChangeComplete", url => {
   console.log("event routeChangeComplete", url)
})
Router.events.on("routeChangeError", (err, url) => {
   console.log("event routeChangeError", url, err)
})
