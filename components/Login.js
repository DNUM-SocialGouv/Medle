import React, { useState, useRef } from "react"
import PropTypes from "prop-types"
import Link from "next/link"
import { Alert, Label, Button, Form, FormGroup, InputGroup, InputGroupAddon, Spinner } from "reactstrap"

const Login = ({ authentication, error }) => {
   const [isLoading, setIsLoading] = useState(false)

   const emailRef = useRef(null)
   const passwordRef = useRef(null)

   const onSubmit = async e => {
      e.preventDefault()
      console.log("email", emailRef.current.value)
      console.log("password", passwordRef.current.value)

      setIsLoading(true)
      try {
         await authentication({ email: emailRef.current.value, password: passwordRef.current.value })
         // eslint-disable-next-line no-empty
      } catch (ignore) {}
   }

   return (
      <>
         <img src={"/images/logo.png"} alt="logo" title="logo" />
         <div>
            <div className="encadre">
               <Form onSubmit={onSubmit} data-testid="authent-form" method="post">
                  <FormGroup>
                     <Label for="email">Adresse courriel</Label>
                     <InputGroup>
                        <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                        <input
                           type="email"
                           name="email"
                           id="email"
                           placeholder="spike.spiegel@cowboy.fr"
                           ref={emailRef}
                           className={"form-control"}
                        />
                     </InputGroup>
                  </FormGroup>
                  <FormGroup>
                     <Label for="password">Mot de passe</Label>
                     <div className="float-right">
                        <Link href="forgotPassword">
                           <a>Mot de passe oublié&nbsp;?</a>
                        </Link>
                     </div>
                     <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Mot de passe"
                        ref={passwordRef}
                        className={"form-control"}
                     />
                  </FormGroup>
                  <Button block>{isLoading ? <Spinner color="light" data-testid="loading" /> : "Se connecter"}</Button>
                  <Alert color="danger" isOpen={!!error} className="mt-3 mb-0" fade={false}>
                     {error}
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
   authentication: PropTypes.func.isRequired,
   error: PropTypes.string,
}

export default Login
