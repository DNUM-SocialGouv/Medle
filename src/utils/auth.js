import * as jwt from "jsonwebtoken"
import moment from "moment"
import Router from "next/router"
import React from "react"

import { API_URL, LOGOUT_ENDPOINT, timeout } from "../config"
import { APIError } from "./errors"
import { STATUS_401_UNAUTHORIZED, STATUS_403_FORBIDDEN } from "./http"
import { clearReferenceData, fetchReferenceData } from "./init"
import { checkToken, decodeToken } from "./jwt"
import { logDebug, logError } from "./logger"
import { isAllowed, startPageForRole, SUPER_ADMIN } from "./roles"

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

  await Router.push("/")
}

export const registerAndRedirectUser = (user) => {
  fetchReferenceData()
  sessionStorage.setItem("currentUser", JSON.stringify({ ...user, authentifiedAt: moment() }))

  Router.push(startPageForRole(user.role))
}

export const getCurrentUser = (ctx) => {
  if (ctx?.req) {
    // Server side navigation
    logDebug("getCurrentUser from server side")
    const res = getTokenFromCookie(ctx)
    return res ? jwt.decode(res) : null
  } else {
    // Client side navigation
    logDebug("getCurrentUser from client side")
    return getCurrentUserFromSessionStorage()
  }
}
export const getCurrentUserFromSessionStorage = () => {
  if (typeof sessionStorage === "undefined") return null

  const currentUser = sessionStorage?.getItem("currentUser")

  return currentUser ? JSON.parse(currentUser) : null
}

const getTokenFromCookie = (ctx) => {
  // Can't work on client side
  if (!ctx || !ctx.req) return ""

  const cookieContent = ctx.req.headers.cookie

  if (!cookieContent) return ""

  // Not useful to verify that token is valid Max-Age wise, since the API will verify it for us
  const res = cookieContent
    .split(";")
    .map((elt) => elt.trim())
    .filter((elt) => /token/.test(elt))

  if (!res.length || res.length !== 1) {
    logError("Erreur dans le cookie token")
    return ""
  } else {
    return res[0].replace(/token=/, "")
  }
}

// On server side, fetch needs to carry the cookie which contains the JWT token, so here we prepare the options
export const buildAuthHeaders = (ctx) => {
  const token = getTokenFromCookie(ctx)
  return token
    ? {
        cookie: `token=${token}`,
      }
    : {}
}

export const isomorphicRedirect = (ctx, url) => {
  if (ctx?.req) {
    // Server side navigation
    ctx.res.writeHead(302, { Location: url })
    ctx.res.end()
  } else {
    // Client side navigation
    Router.push(url)
  }
}

const sessionTooOld = (currentUser) => {
  if (!currentUser) return true
  return currentUser.authentifiedAt && moment(currentUser.authentifiedAt).add(timeout.session) < moment()
}

export const withAuthentication = (WrappedComponent, requiredPrivilege, { redirect = true } = {}) => {
  const Wrapper = (props) => <WrappedComponent {...props} />

  Wrapper.getInitialProps = async (ctx) => {
    const currentUser = getCurrentUser(ctx)

    logDebug("currentUser", currentUser)

    if (redirect) {
      if (!currentUser || sessionTooOld(currentUser)) {
        logError("Pas de currentUser trouvé en cookie ou en SessionStorage. Redirection sur index")
        isomorphicRedirect(ctx, "/?sessionTimeout=1")
        return {}
      }

      if (requiredPrivilege && !isAllowed(currentUser.role, requiredPrivilege)) {
        logError("Rôle incorrect. Redirection sur page permissionError")
        isomorphicRedirect(ctx, "/permissionError")
        return {}
      }
    }

    const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))

    return { ...componentProps, currentUser }
  }

  return Wrapper
}

export const redirectIfUnauthorized = (error, ctx) => {
  if (error?.status === 401) {
    isomorphicRedirect(ctx, "/?sessionTimeout=1")
  }
}

export const checkIsSuperAdmin = (currentUser) => {
  if (currentUser?.role !== SUPER_ADMIN) {
    throw new APIError({
      message: `Not allowed role (${currentUser.email ? currentUser.email : "unknown user"})`,
      status: STATUS_403_FORBIDDEN,
    })
  }
}

export const checkValidUserWithPrivilege = (privilege, req) => {
  const { token } = req.cookies

  try {
    if (!token) {
      throw new APIError({
        message: "Non authentified user",
        status: STATUS_401_UNAUTHORIZED,
      })
    }

    const currentUser = checkToken(token)

    if (!isAllowed(currentUser.role, privilege)) {
      throw new APIError({
        message: `Not allowed role (${currentUser.email ? currentUser.email : "unknown user"})`,
        status: STATUS_403_FORBIDDEN,
      })
    } else {
      return currentUser
    }
  } catch (error) {
    if (error instanceof APIError) throw error

    let email
    try {
      // Let's try to get user informations even if the token is not valid
      const currentUser = decodeToken(token)
      email = currentUser.email
    } catch (error) {
      logError("Token couldn't been decoded")
    }
    throw new APIError({
      message: `Invalid token for user (${email ? email : "unknown user"})`,
      status: STATUS_401_UNAUTHORIZED,
    })
  }
}
