import React from "react"
import Router from "next/router"
import { API_URL, LOGOUT_ENDPOINT } from "../config"
import * as jwt from "jsonwebtoken"
import { isAllowed, START_PAGES } from "./roles"
import moment from "moment"
import { fetchReferenceData, clearReferenceData } from "./init"
import { logError } from "./logger"

// Timeout config : keep this timeout values in sync
export const timeout = {
   jwt: "7h",
   cookie: 7 * 60 * 60,
   session: { hours: 7 },
}

/**
 * Remarks on cookie & session storage:
 *
 * - token is a cookie set by the API. It is HttpOnly, so there is no risk (or less risks) to have XSS exploits.
 * - local storage is not a viable solution since it doesn't support SSR and it doesn't prevent XSS like cookie
 * - currentUser includes data of the user, without the token
 * - use session storage to store data of the user without the token, allowing to drive the UI. This is XSS exploitable but without the token content, there should be no way to call the API endpoints
 */

export const logout = async () => {
   // Let API send a cookie with very close expiration date to reset the "token" cookie with HttpOnly
   await fetch(API_URL + LOGOUT_ENDPOINT)

   sessionStorage.removeItem("currentUser")

   clearReferenceData()

   await Router.push("/index")
}

export const registerAndRedirectUser = json => {
   fetchReferenceData()
   sessionStorage.setItem("currentUser", JSON.stringify({ ...json, authentifiedAt: moment() }))

   const startPage = START_PAGES[json.role] || "/actDeclaration"

   Router.push(startPage)
}

export const getCurrentUser = ctx => {
   if (ctx && ctx.req) {
      // Server side navigation
      const res = getTokenFromCookie(ctx)
      return res ? jwt.decode(res) : null
   } else {
      // Client side navigation
      return getCurrentUserFromSessionStorage()
   }
}
export const getCurrentUserFromSessionStorage = () => {
   const currentUser = sessionStorage.getItem("currentUser")

   return currentUser ? JSON.parse(currentUser) : null
}

const getTokenFromCookie = ctx => {
   // Can't work on client side
   if (!ctx || !ctx.req) return ""

   const cookieContent = ctx.req.headers.cookie

   if (!cookieContent) return ""

   // Not useful to verify that token is valid Max-Age wise, since the API will verify it for us
   const res = cookieContent
      .split(";")
      .map(elt => elt.trim())
      .filter(elt => /token/.test(elt))

   if (!res.length || res.length !== 1) {
      logError("Erreur dans le cookie token")
      return ""
   } else {
      return res[0].replace(/token=/, "")
   }
}

// On server side, fetch needs to carry the cookie which contains the JWT token, so here we prepare the options
export const buildOptionsFetch = ctx => {
   const token = getTokenFromCookie(ctx)
   return token
      ? {
           headers: {
              cookie: `token=${token}`,
           },
        }
      : null
}

export const isomorphicRedirect = (ctx, url) => {
   if (ctx && ctx.req) {
      // Server side navigation
      ctx.res.writeHead(302, { Location: url })
      ctx.res.end()
   } else {
      // Client side navigation
      Router.push(url)
   }
}

const sessionTooOld = currentUser => {
   return currentUser.authentifiedAt && moment(currentUser.authentifiedAt).add(timeout.session) < moment()
}

export const withAuthentication = (WrappedComponent, requiredPrivilege) => {
   const Wrapper = props => <WrappedComponent {...props} />

   Wrapper.getInitialProps = async ctx => {
      const currentUser = getCurrentUser(ctx)

      console.log("currentUser", currentUser)

      if (!currentUser || sessionTooOld(currentUser)) {
         logError("Pas de currentUser 1 trouvé en cookie ou en SessionStorage. Redirection sur index")
         isomorphicRedirect(ctx, "/index?sessionTimeout=1")
      }

      if (requiredPrivilege && !isAllowed(currentUser.role, requiredPrivilege)) {
         logError("Rôle incorrect. Redirection sur page permissionError")
         isomorphicRedirect(ctx, "/permissionError")
      }

      const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))

      return { ...componentProps, currentUser }
   }

   return Wrapper
}

export const redirectIfUnauthorized = (error, ctx) => {
   console.log("error.Status", error.status)

   if (error && error.status === 401) {
      isomorphicRedirect(ctx, "/index?sessionTimeout=1")
   }
}
