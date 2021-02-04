import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye"
import Link from "next/link"
import PropTypes from "prop-types"
import React, { useRef, useState } from "react"
import { Alert, Button, Form, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Label, Spinner } from "reactstrap"

const Login = ({ authentication, error }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [hidden, setHidden] = useState(true)

  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const onSubmit = async (e) => {
    e.preventDefault()

    setHidden(true)
    setIsLoading(true)
    try {
      await authentication({ email: emailRef.current.value, password: passwordRef.current.value })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClick = () => {
    setHidden((state) => !state)
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
                  autoComplete="email"
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
              <InputGroup>
                <input
                  type={hidden ? "password" : "text"}
                  name="password"
                  id="password"
                  placeholder="Mot de passe"
                  ref={passwordRef}
                  className={"form-control"}
                  autoComplete="current-password"
                />
                <InputGroupAddon addonType="append" style={{ backgroundColor: "#e9ecef" }}>
                  <InputGroupText
                    style={{
                      borderColor: "#ced4da",
                      backgroundColor: "#e9ecef",
                    }}
                    onClick={handleClick}
                    className={hidden ? "" : "text-primary"}
                  >
                    <RemoveRedEyeIcon width={24} />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
            <Button block className="d-flex justify-content-center align-items-center">
              Se connecter&nbsp;
              {isLoading ? <Spinner size="sm" className="ml-2" color="light" data-testid="loading" /> : ""}
            </Button>
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
        :-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: #767676;
        }
        ::-ms-input-placeholder {
          /* Microsoft Edge */
          color: #767676;
        }

        img[alt="logo"] {
          max-width: 300px;
          object-fit: contain;
        }

        @media screen and (max-width: 768px) {
          img[alt="logo"] {
            width: 100%;
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
