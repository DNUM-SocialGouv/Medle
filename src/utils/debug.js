import React, { useEffect, useRef } from "react"
import { useRouter } from "next/router"
import { logInfo } from "./logger"

// useEffect(() => {
//    logInfo("XX dans useEffect")
//    const routeChangeComplete = async () => {
//       logInfo("XXX dans routeChangeComplete")
//       window.scrollTo(0, 0)

//       logInfo("mainRef", mainRef)

//       if (mainRef && mainRef.current) {
//          mainRef.current.focus()
//       }
//    }
//    router.events.on("routeChangeComplete", routeChangeComplete)

//    return () => {
//       router.events.off("routeChangeComplete", routeChangeComplete)
//    }
// }, [router.events])

export const DebugRouter = () => {
   const router = useRouter()

   router.events.on("routeChangeStart", url => {
      logInfo("event routeChangeStart", url)
   })
   router.events.on("routeChangeComplete", url => {
      logInfo("event routeChangeComplete", url)
   })
   router.events.on("routeChangeError", (err, url) => {
      logInfo("event routeChangeError", url, err)
   })

   return null
}
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
         logInfo("Changed props:", changedProps)
      }
      prev.current = props
   })
}

// usage: <Logger label="Mon composant à loguer" />
export const Logger = props => {
   logInfo(`${props.label} rendered`)
   return null // irrelevant
}
