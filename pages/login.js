import React from "react"
import Link from "next/link"
import { Form, FormGroup, Label, Input, Button } from "reactstrap"

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
   return (
      <div style={stylePage}>
         <div>
            <h1 style={{ textAlign: "center", margin: "30px 0" }}>Connexion</h1>
            <div style={styleEncadre}>
               <Form>
                  <FormGroup>
                     <Label for="email">Adresse courriel</Label>
                     <Input type="email" name="email" id="email" placeholder="michel.martin@caramail.fr" />
                  </FormGroup>
                  <FormGroup>
                     <Label for="password">Mot de passe</Label>
                     <div style={{ float: "right" }}>
                        <Link href="forgotPassword">
                           <a>Mot de passe oublié&nbsp;?</a>
                        </Link>
                     </div>
                     <Input type="password" name="password" id="password" placeholder="Mot de passe" />
                  </FormGroup>
                  <Button block>Se connecter</Button>
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
