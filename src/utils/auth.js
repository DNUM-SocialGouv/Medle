import React, { useEffect } from "react"
import Router from "next/router"
import nextCookie from "next-cookies"
import cookie from "js-cookie"

export const login = async ({ token, role, hospitalId }) => {
   cookie.set("token", token, { expires: 1 })
   cookie.set("role", role, { expires: 1 })
   if (hospitalId) {
      cookie.set("hospitalId", hospitalId, { expires: 1 })
   }
   await Router.push("/home")
}

export const logout = async () => {
   cookie.remove("token")
   // to support logging out from all windows
   window.localStorage.setItem("logout", Date.now())
   await Router.push("/index")
}

export const auth = ctx => {
   const { token } = nextCookie(ctx)

   /*
    * If `ctx.req` is available it means we are on the server.
    * Additionally if there's no token it means the user is not logged in.
    */
   if (ctx.req && !token) {
      ctx.res.writeHead(302, { Location: "/index" })
      ctx.res.end()
   }

   // We already checked for server. This should only happen on client.
   if (!token) {
      Router.push("/login")
   }

   return token
}

export const withAuthSync = WrappedComponent => {
   const Wrapper = props => {
      const syncLogout = event => {
         if (event.key === "logout") {
            Router.push("/index")
         }
      }

      useEffect(() => {
         window.addEventListener("storage", syncLogout)

         return () => {
            window.removeEventListener("storage", syncLogout)
            window.localStorage.removeItem("logout")
         }
      }, [])

      return <WrappedComponent {...props} />
   }

   Wrapper.getInitialProps = async ctx => {
      const token = auth(ctx)

      const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))

      return { ...componentProps, token }
   }

   return Wrapper
}
