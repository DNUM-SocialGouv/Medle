import React, { useState } from "react"
import Head from "next/head"
import fetch from "isomorphic-unfetch"
import { login } from "../utils/auth"
import Login from "../components/Login"
import { STATUS_200_OK } from "../utils/HttpStatus"

const LoginPage = () => {
   const [error, setError] = useState("")
   const isValidUserData = ({ email, password }) => !!(email && password)

   const authentication = userData => {
      return new Promise((resolve, reject) => {
         setError("")

         setTimeout(async () => {
            const valid = isValidUserData(userData)

            if (!valid) {
               setError("Problème d'authentification")
               reject(error)
            } else {
               const { email, password } = userData
               const url = "/api/login"

               try {
                  const response = await fetch(url, {
                     method: "POST",
                     headers: { "Content-Type": "application/json" },
                     body: JSON.stringify({ email, password }),
                  })
                  const json = await response.json()
                  if (response.status === STATUS_200_OK) {
                     const { token } = json
                     await login({ token })
                     resolve("OK")
                  } else {
                     throw {
                        response,
                        json,
                     }
                  }
               } catch (error) {
                  const message = error && error.json ? error.json.message : "Erreur serveur"
                  setError(message)
                  reject(message)
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
