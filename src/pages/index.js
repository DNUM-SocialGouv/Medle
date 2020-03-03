import React, { useState } from "react"
import Head from "next/head"
import fetch from "isomorphic-unfetch"
import { API_URL, LOGIN_ENDPOINT } from "../config"
import Login from "../components/Login"
import { handleAPIResponse, ValidationError } from "../utils/errors"
import { METHOD_POST } from "../utils/http"
import { registerAndRedirectUser } from "../utils/auth"
import PropTypes from "prop-types"
import { trackEvent, CATEGORY, ACTION } from "../utils/matomo"
import { logError } from "../utils/logger"

const LoginPage = ({ message }) => {
   const [error, setError] = useState(message || "")
   const checkUserData = ({ email, password }) => {
      if (!email || !password) throw new ValidationError("Les champs ne peuvent pas être vides")
   }
   let isMounted = false

   const authentication = userData => {
      isMounted = true
      return new Promise((resolve, reject) => {
         if (isMounted) setError("")

         setTimeout(async () => {
            const { email, password } = userData

            try {
               checkUserData(userData)

               const response = await fetch(API_URL + LOGIN_ENDPOINT, {
                  method: METHOD_POST,
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, password }),
               })
               const json = await handleAPIResponse(response)

               registerAndRedirectUser(json)
               trackEvent(CATEGORY.auth, ACTION.auth.connection)
               resolve("OK")
            } catch (error) {
               logError(error)
               if ((error.status && error.status === 401) || error instanceof ValidationError) {
                  setError("L'authentification est incorrecte")
               } else {
                  setError("Problème serveur")
               }
               trackEvent(CATEGORY.auth, ACTION.auth.error, (userData && userData.email) || "no email")
               reject(error)
            }
         }, 1000)
      })
   }

   return (
      <>
         <Head>
            <title>Medlé : connexion</title>
         </Head>

         <div>
            <Login authentication={authentication} error={error} />
         </div>

         <style jsx>{`
            div {
               margin-top: 20vh;
               display: flex;
               justify-content: center;
               align-items: flex-start;
               background-color: white;
            }
         `}</style>
      </>
   )
}

LoginPage.propTypes = {
   message: PropTypes.string,
}

LoginPage.getInitialProps = async ctx => {
   const {
      query: { sessionTimeout },
   } = ctx

   if (sessionTimeout) {
      return { message: "Votre session s'est terminée." }
   }
   return { message: "" }
}

export default LoginPage
