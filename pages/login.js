import React from "react"
import Head from "next/head"
import fetch from "isomorphic-unfetch"
import { login } from "../utils/auth"
import Login from "../components/login"

const LoginPage = () => {
   const isValidUserData = ({ email, password }) => !!(email && password)

   const onSubmit = async (e, userData, setUserData) => {
      e.preventDefault()

      setUserData({ ...userData, error: "" })

      const valid = isValidUserData(userData)

      if (!valid) {
         setUserData({ ...userData, error: "Problème d'authentification" })
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
            if (response.status === 200) {
               const { token } = json
               await login({ token })
            } else {
               console.error("Login failed.")
               throw {
                  httpStatusCode: response.status,
                  httpStatusText: response.statusText,
                  json,
               }
            }
         } catch (error) {
            console.error("You have an error in your code or there are Network issues.", error)

            const { json } = error
            setUserData({ ...userData, error: json.message })
         }
      }
   }

   return (
      <>
         <Head>
            <title>Medlé : connexion</title>
         </Head>

         <div>
            <Login onSubmit={onSubmit} />
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
