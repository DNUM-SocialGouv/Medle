import Router from "next/router"
import { logInfo } from "./logger"

export function initMatomo({ siteId, piwikUrl, jsTrackerFile = "piwik.js", phpTrackerFile = "piwik.php" }) {
   logInfo("Initialisation de Matomo")

   window._paq = window._paq || []
   let previousPath = ""
   matopush(["setSiteId", siteId])
   matopush(["setTrackerUrl", `${piwikUrl}/${phpTrackerFile}`])
   matopush(["enableLinkTracking"])

   /**
    * for intial loading we use the location.pathname
    * as the first url visited.
    * Once user navigate accross the site,
    * we rely on Router.pathname
    */
   matopush(["setCustomUrl", location.pathname])
   matopush(["trackPageView"])
   const scriptElement = document.createElement("script")
   const refElement = document.getElementsByTagName("script")[0]
   scriptElement.type = "text/javascript"
   scriptElement.async = true
   scriptElement.defer = true
   scriptElement.src = `${piwikUrl}/${jsTrackerFile}`
   refElement.parentNode.insertBefore(scriptElement, refElement)
   previousPath = location.pathname

   Router.events.on("routeChangeComplete", path => {
      // We use only the part of the url without the querystring to ensure piwik is happy
      // It seems that piwiki doesn't track well page with querystring
      const [pathname] = path.split("?")
      // if (previousPath === pathname) {
      //    return
      // }

      // In order to ensure that the page title had been updated,
      // we delayed pushing the tracking to the next tick.
      setTimeout(() => {
         const { q, source } = Router.query
         if (previousPath) {
            matopush(["setReferrerUrl", `${previousPath}`])
         }
         matopush(["setCustomUrl", pathname])
         matopush(["setDocumentTitle", document.title])
         matopush(["deleteCustomVariables", "page"])
         matopush(["setGenerationTimeMs", 0])
         if (/^\/recherche/.test(pathname)) {
            matopush(["trackSiteSearch", q, source])
         } else {
            matopush(["trackPageView"])
         }
         matopush(["enableLinkTracking"])
         previousPath = pathname
      }, 0)
   })
}

export function matopush(args) {
   window._paq.push(args)
}

export const CATEGORY = {
   act: "acte",
   emp: "etp",
   stat: "statistiques",
   auth: "authentification",
}

export const ACTION = {
   act: {
      declaration: "declaration",
      ajout: "ajout",
      suppression: "suppression",
      modification: "modification",
   },
   emp: {
      declaration: "declaration",
      modification: "modification",
      lecture: "lecture",
      validation: "validation",
   },
   stat: {
      global: "global",
      living: "vivant",
      dead: "thanatologie",
   },
   auth: {
      connection: "connexion",
      deconnection: "déconnexion",
      error: "erreur",
   },
}

/**
 * Matomo tracker
 *
 * @param {*} category category name (see CATEGORIES above)
 * @param {*} action action applied on the entity (see ACTIONS above)
 * @param {*} name (optionnel) entity (if any)
 * @param {*} value (optionnel) value of entity (if any)
 */
export const trackEvent = (category, action, name, value) => {
   matopush(["trackEvent", category, action, name, value])
}
