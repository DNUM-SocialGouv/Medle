import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye"
import Link from "next/link"
import PropTypes from "prop-types"
import React, { useRef, useState } from "react"
import { Alert, Col, Form, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Row, Spinner } from "reactstrap"

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

  const MandatorySign = () => (
    <span style={{ color: "#1e1e1e" }} aria-hidden="true">
      *
    </span>
  )

  return (
    <>
      <main role="main">
        <div>
          <Form onSubmit={onSubmit} data-testid="authent-form" method="post">
            <h1 className="login-h1">Connexion</h1>
            <Row>
              <Col sm="4">
                <FormGroup>
                  <label htmlFor="email" className="login-label">
                    {"Identifiant"}&nbsp;
                    <MandatorySign />
                  </label>
                  <InputGroup>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      ref={emailRef}
                      className={"form-control login-input"}
                      autoComplete="email"
                      aria-required="true"
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <label htmlFor="password" className="login-label">
                    {"Mot de passe"}&nbsp;
                    <MandatorySign />
                  </label>
                  <InputGroup>
                    <input
                      type={hidden ? "password" : "text"}
                      name="password"
                      id="password"
                      ref={passwordRef}
                      className={"form-control login-input"}
                      autoComplete="current-password"
                      aria-required="true"
                    />
                    <InputGroupAddon addonType="append" style={{ backgroundColor: "#f0f0f0" }}>
                      <button
                        type="button"
                        className="button-eye"
                        onClick={handleClick}
                        aria-label="Afficher ou masquer le mot de passe"
                      >
                        <InputGroupText
                          style={{
                            backgroundColor: "#f0f0f0",
                            borderColor: "#f0f0f0",
                          }}
                          className={hidden ? "" : "text-primary"}
                        >
                          <RemoveRedEyeIcon width={24} focusable="true" style={{ cursor: "pointer" }} />
                        </InputGroupText>
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col sm="4">
                <button className="button-connexion">
                  Connexion&nbsp;
                  {isLoading ? <Spinner size="sm" className="ml-2 mb-1" color="light" data-testid="loading" /> : " "}
                </button>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="float-left">
                  <Link href="/forgot-password">
                    <a style={{ color: "#000091" }}>{"J'ai oublié mon mot de passe"}</a>
                  </Link>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Alert color="danger" isOpen={!!error} className="pt-10 mt-3 mb-0" fade={false}>
                  {error}
                </Alert>
              </Col>
            </Row>
          </Form>
        </div>
        <style jsx>{`
          .login-h1 {
            font-size: 2em;
            color: #383838;
          }
          .login-label {
            font-size: 1.1em;
            color: #1e1e1e;
          }
          .login-input {
            border: none;
            background-color: #f0f0f0;
            border-bottom: 2px solid #6a6a6a;
            border-radius: 3px 3px 0 0;
          }
          .button-eye {
            border: none;
            padding: 0;
            display: flex;
          }
          .button-connexion {
            font-size: 1.2em;
            border: none;
            background-color: #000091;
            color: #ffffff;
            padding: 0.4em 1.4em 0.4em 1.4em;
            margin-top: 2.4em;
          }
          .button-connexion:focus {
            background-color: #1212ff;
          }
          .button-connexion:hover {
            background-color: #1212ff;
          }
          main {
            display: flex;
          }
        `}</style>
      </main>
    </>
  )
}

Login.propTypes = {
  authentication: PropTypes.func.isRequired,
  error: PropTypes.string,
}

export default Login
