import React, { useState } from "react"
import Head from "next/head"
import fetch from "isomorphic-unfetch"
import { API_URL, LOGIN_ENDPOINT } from "../config"
import { login } from "../utils/auth"
import Login from "../components/Login"
import { handleAPIResponse } from "../utils/errors"

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
               setError("L'authentification est incorrecte")
               console.error("L'authentification est incorrecte")

               reject("L'authentification est incorrecte")
            } else {
               const { email, password } = userData

               try {
                  const response = await fetch(API_URL + LOGIN_ENDPOINT, {
                     method: "POST",
                     headers: { "Content-Type": "application/json" },
                     body: JSON.stringify({ email, password }),
                  })
                  const json = await handleAPIResponse(response)
                  console.log("json", json)

                  await login(json)
                  resolve("OK")
               } catch (error) {
                  console.error(`${error}`)
                  console.log("error.status", error.status)
                  if (error.status && error.status === 401) {
                     setError("L'authentification est incorrecte 2")
                  } else {
                     setError("Problème en base de données")
                  }
                  reject(error)
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
