import React, { useState } from "react"
import PropTypes from "prop-types"
import Link from "next/link"
import { Alert, Label, Button, Form, FormGroup, Input, Spinner } from "reactstrap"

const Login = ({ onSubmit }) => {
   const [userData, setUserData] = useState({
      email: "michel.martin@caramail.fr",
      password: "",
      error: "",
      isLoading: false,
   })

   const onChange = e => {
      setUserData({ ...userData, email: e.target.value })
   }

   const onChangePassword = e => {
      setUserData({ ...userData, password: e.target.value })
   }

   return (
      <>
         <img src={"/images/logo.png"} alt="logo" title="logo" />
         <div>
            <div className="encadre">
               <Form onSubmit={e => onSubmit(e, userData, setUserData)}>
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
                  <Button block>
                     {userData.isLoading ? <Spinner color="light">Loading...</Spinner> : "Se connecter"}
                  </Button>
                  <Alert color="danger" isOpen={!!userData.error} className="mt-3 mb-0" fade={false}>
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
         <style jsx>{`
            div.encadre {
               background-color: rgb(249, 249, 249);
               border: 1px solid lightgrey;
               padding: 20px;
               border-radius: 10px;
            }
            img[alt="logo"] {
               margin: 100px 50px;
               width: 300px;
            }
         `}</style>
      </>
   )
}

Login.propTypes = {
   onSubmit: PropTypes.func.isRequired,
}

export default Login
