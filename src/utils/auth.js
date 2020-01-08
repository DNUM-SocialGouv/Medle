import React from "react"
import Router from "next/router"
import { API_URL, LOGOUT_ENDPOINT } from "../config"
import * as jwt from "jsonwebtoken"
import { isAllowed } from "./roles"

/**
 * Remarks on cookie & session storage:
 *
 * - token is a cookie set API side. It is HttpOnly, so there is no risk (or less risks) to have XSS exploits.
 * the true security is only needeed on the API side
 * - local storage is not a viable solution since it doesn't support SSR and it doesn't prevent XSS like cookie
 * - dataUser contient une sous-partie de token. Pas d'information privée (email), pas de signature
 * - use session storage to store the non private data of the user and to drive the UI. This is XSS exploitable but there will not have incidence with API side
 */

export const logout = async () => {
   // Let API send a cookie with very close expiration date to reset the "token" cookie with HttpOnly
   await fetch(API_URL + LOGOUT_ENDPOINT)

   sessionStorage.removeItem("dataUser")

   await Router.push("/index")
}

const getDataUser = ctx => {
   if (ctx && ctx.req) {
      // Server side navigation
      const res = getTokenContentFromCookie(ctx)
      return res ? jwt.decode(res) : null
   } else {
      // Client side navigation
      return getDataUserFromSessionStorage()
   }
}
export const getDataUserFromSessionStorage = () => {
   const dataUser = sessionStorage.getItem("dataUser")
   return dataUser ? JSON.parse(dataUser) : null
}

const getTokenContentFromCookie = ctx => {
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

export const withAuthSync = (WrappedComponent, requiredPrivilege) => {
   const Wrapper = props => <WrappedComponent {...props} />

   Wrapper.getInitialProps = async ctx => {
      // const { pathname } = ctx
      // const isPublic =
      //    pathname === "/index" ||
      //    pathname === "/signup" ||
      //    pathname === "/inscription" ||
      //    pathname === "/" ||
      //    pathname === "/account/reset-password" ||
      //    pathname === "/account/forgot-password"
      const dataUser = getDataUser(ctx)

      if (!dataUser) {
         if (ctx && ctx.req) {
            // Server side navigation
            ctx.res.writeHead(302, { Location: "/index" })
            ctx.res.end()
         } else {
            // Client side navigation
            Router.push("/index")
         }
         return
      }

      if (!isAllowed(dataUser.role, requiredPrivilege)) {
         return { permissionError: "Vous n'êtes pas autorisé à voir cette page" }
      }

      const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))

      return { ...componentProps, dataUser }
   }

   return Wrapper
}
