import React from "react"
import Router from "next/router"
import { API_URL, LOGOUT_ENDPOINT } from "../config"
import * as jwt from "jsonwebtoken"
import { isAllowed, START_PAGES } from "./roles"

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

   await Router.push("/index")
}

export const registerAndRedirectUser = json => {
   sessionStorage.setItem("currentUser", JSON.stringify(json))

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
   const cookieContent = ctx.req.headers.cookie

   if (!cookieContent) return ""

   const res = cookieContent
      .split(";")
      .map(elt => elt.trim())
      .filter(elt => /token/.test(elt))

   if (!res.length || res.length !== 1) {
      console.error("Erreur dans le cookie token")
      return ""
   } else {
      return res[0].replace(/token=/, "")
   }
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

export const withAuthentication = (WrappedComponent, requiredPrivilege) => {
   const Wrapper = props => <WrappedComponent {...props} />

   Wrapper.getInitialProps = async ctx => {
      const currentUser = getCurrentUser(ctx)

      if (!currentUser) {
         isomorphicRedirect(ctx, "/index")
      }

      if (requiredPrivilege && !isAllowed(currentUser.role, requiredPrivilege)) {
         isomorphicRedirect(ctx, "/permissionError")
      }

      const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))

      return { ...componentProps, currentUser }
   }

   return Wrapper
}
