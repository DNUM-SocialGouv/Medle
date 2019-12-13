import React, { useEffect, useRef } from "react"
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

// Usage
// function MyComponent(props) {
//    useTraceUpdate(props)
//    return <div>{props.children}</div>
// }
export const useTraceUpdate = props => {
   const prev = useRef(props)
   useEffect(() => {
      const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
         if (prev.current[k] !== v) {
            ps[k] = [prev.current[k], v]
         }
         return ps
      }, {})
      if (Object.keys(changedProps).length > 0) {
         console.log("Changed props:", changedProps)
      }
      prev.current = props
   })
}
