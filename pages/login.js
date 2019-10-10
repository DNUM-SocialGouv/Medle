import React, { useState } from "react"
import Link from "next/link"
import { Alert, Form, FormGroup, Label, Input, Button } from "reactstrap"
import fetch from "isomorphic-unfetch"
import { login } from "../utils/auth"

const stylePage = {
   display: "flex",
   justifyContent: "center",
   alignItems: "center",
   backgroundColor: "rgb(249, 249, 249)",
}

const styleEncadre = {
   backgroundColor: "white",
   border: "1px solid lightgrey",
   padding: 20,
   borderRadius: 10,
}

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
      console.log("dans onsubmit", userData)

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
      <div style={stylePage}>
         <div>
            <h1 style={{ textAlign: "center", margin: "30px 0" }}>Connexion</h1>
            <div style={styleEncadre}>
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
                     />
                  </FormGroup>
                  <FormGroup>
                     <Label for="password">Mot de passe</Label>
                     <div style={{ float: "right" }}>
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
                  <Alert color="danger" isOpen={userData.error} style={{ marginTop: 10 }}>
                     {userData.error}
                  </Alert>
               </Form>
            </div>
            <div style={{ ...styleEncadre, marginTop: 20 }}>
               Vous êtes nouveau sur Medlé&nbsp;?{" "}
               <Link href="createAccount">
                  <a>Créer un compte</a>
               </Link>
            </div>
         </div>
      </div>
   )
}

export default LoginPage
