import React, { useState } from "react"
import Head from "next/head"
import fetch from "isomorphic-unfetch"
import { API_URL, LOGIN_ENDPOINT } from "../config"
import { login } from "../utils/auth"
import Login from "../components/Login"
import { STATUS_200_OK } from "../utils/HttpStatus"

const LoginPage = () => {
   const [error, setError] = useState("")
   const isValidUserData = ({ email, password }) => !!(email && password)
   let isMounted = false

   const authentication = userData => {
      isMounted = true
      return new Promise((resolve, reject) => {
         if (isMounted) setError("")

         setTimeout(async () => {
            const valid = isValidUserData(userData)

            if (!valid) {
               const error = {
                  message: "Problème d'authentification",
                  detail: "Contrôle de forme KO",
               }
               console.error(error)
               if (isMounted) setError(error.message)
               reject(error)
            } else {
               const { email, password } = userData

               try {
                  const response = await fetch(API_URL + LOGIN_ENDPOINT, {
                     method: "POST",
                     headers: { "Content-Type": "application/json" },
                     body: JSON.stringify({ email, password }),
                  })
                  const json = await response.json()
                  if (response.status === STATUS_200_OK) {
                     const { token, userId, role, hospitalId } = json
                     console.log("json", json)
                     await login({ token, userId, role, hospitalId })
                     console.log("after login")
                     resolve("OK")
                  } else {
                     throw {
                        httpStatus: response.status,
                        message: json.error && json.error.message ? json.error.message : "Erreur serveur",
                        detail: json.error.detail,
                     }
                  }
               } catch (error) {
                  console.error(error.message ? error.message : "Erreur", error)
                  if (isMounted) setError(error.message)
                  reject(error.message)
               }
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

export default LoginPage
