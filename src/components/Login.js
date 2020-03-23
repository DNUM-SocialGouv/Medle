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

      setIsLoading(true)
      try {
         await authentication({ email: emailRef.current.value, password: passwordRef.current.value })
         setIsLoading(false)
      } catch (ignore) {
         setIsLoading(false)
      }
   }

   return (
      <>
         <img src={"/images/logo.png"} alt="logo" title="logo" className="my-5" />
         <div>
            <div className="encadre shadow border mx-4 px-3 py-4 rounded">
               <Form onSubmit={onSubmit} data-testid="authent-form" method="post">
                  <FormGroup>
                     <Label for="email">Adresse courriel</Label>
                     <InputGroup>
                        <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                        <input
                           type="email"
                           name="email"
                           id="email"
                           placeholder="adresse@mail.com"
                           ref={emailRef}
                           className={"form-control"}
                           autoComplete="username"
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
                        autoComplete="current-password"
                     />
                  </FormGroup>
                  <Button block>{isLoading ? <Spinner color="light" data-testid="loading" /> : "Se connecter"}</Button>
                  <Alert color="danger" isOpen={!!error} className="mt-3 mb-0" fade={false}>
                     {error}
                  </Alert>
               </Form>
            </div>
            <div className="encadre shadow border m-4 px-3 py-2 rounded">
               Vous êtes nouveau sur Medlé&nbsp;?{" "}
               <Link href="createAccount">
                  <a>Créer un compte</a>
               </Link>
            </div>
         </div>
         <style jsx>{`
            .encadre {
               background-color: rgb(249, 249, 249);
            }
            ::placeholder {
               /* Chrome, Firefox, Opera, Safari 10.1+ */
               color: #767676;
               opacity: 1; /* Firefox */
            }

            img[alt="logo"] {
               width: 300px;
            }

            @media screen and (max-width: 768px) {
               img[alt="logo"] {
                  width: 200px;
               }
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
