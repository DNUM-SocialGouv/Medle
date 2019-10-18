import React, { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { Alert, Form, FormGroup, Label, Input, Button } from "reactstrap"
import fetch from "isomorphic-unfetch"
import { login } from "../utils/auth"

const LoginPage = () => {
   const [userData, setUserData] = useState({
      email: "michel.martin@caramail.fr",
      password: "",
      error: "",
   })

   const onChange = e => {
      setUserData({ ...userData, email: e.target.value })
   }

   const onChangePassword = e => {
      setUserData({ ...userData, password: e.target.value })
   }

   const isValidUserData = ({ email, password }) => !!(email && password)

   const onSubmit = async e => {
      e.preventDefault()

      setUserData(Object.assign({}, userData, { error: "" }))

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
               console.log("token", token)
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
            {/* <link rel="icon" href="/favicon.ico" /> */}
         </Head>

         <div className="page">
            <div>
               <img src={"/images/logo.png"} alt="logo" />
               <div className="encadre">
                  <Form onSubmit={onSubmit}>
                     <FormGroup>
                        <Label for="email">Adresse courriel</Label>
                        <Input
                           type="email"
                           name="email"
                           id="email"
                           placeholder="michel.martin@caramail.fr"
                           value={userData.email}
                           onChange={onChange}
                           autoFocus
                        />
                     </FormGroup>
                     <FormGroup>
                        <Label for="password">Mot de passe</Label>
                        <div className="float-right">
                           <Link href="forgotPassword">
                              <a>Mot de passe oublié&nbsp;?</a>
                           </Link>
                        </div>
                        <Input
                           type="password"
                           name="password"
                           id="password"
                           placeholder="Mot de passe"
                           onChange={onChangePassword}
                        />
                     </FormGroup>
                     <Button block>Se connecter</Button>
                     <Alert color="danger" isOpen={!!userData.error} className="mt-3 mb-0" fade={true}>
                        {userData.error}
                     </Alert>
                  </Form>
               </div>
               <div className="encadre mt-4">
                  Vous êtes nouveau sur Medlé&nbsp;?{" "}
                  <Link href="createAccount">
                     <a>Créer un compte</a>
                  </Link>
               </div>
            </div>
         </div>
         <style jsx>{`
            div.page {
               display: flex;
               justify-content: center;
               align-items: center;
               background-color: white;
            }
            div.encadre {
               background-color: rgb(249, 249, 249);
               border: 1px solid lightgrey;
               padding: 20px;
               border-radius: 10px;
            }
            img[alt="logo"] {
               margin: 80px 0 50px 35px;
               width: 300px;
            }
         `}</style>
      </>
   )
}

export default LoginPage
