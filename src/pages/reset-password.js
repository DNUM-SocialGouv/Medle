import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { useForm } from "react-hook-form"
import { Button, Col, Container, Form, FormFeedback, FormGroup, Input, Label } from "reactstrap"

import { resetPassword } from "../clients/users"
import Layout from "../components/Layout"
import { PasswordForce } from "../components/PasswordForce"
import StatusAlert from "../components/StatusAlert"
import { Title1 } from "../components/StyledComponents"
import { ACTION, CATEGORY, trackEvent } from "../utils/matomo"
import { isEmpty } from "../utils/misc"

const UserReset = () => {
  const {
    handleSubmit,
    register,
    formState: { errors: formErrors },
    watch,
  } = useForm()
  const [status, setStatus] = React.useState({ type: "idle" })
  const router = useRouter()
  const { loginToken } = router.query
  const [showForm, setShowForm] = React.useState(true)

  const [password, setPassword] = React.useState("")

  const onSubmit = async (data) => {
    setStatus({ type: "pending" })

    try {
      if (isEmpty(formErrors)) {
        await resetPassword({ loginToken, password: data.firstValue })

        trackEvent(CATEGORY.auth, ACTION.auth.resetMdp, `: OK`)

        setStatus({ message: "Mot de passe réinitialisé.", type: "success" })
        setShowForm(false)
      }
    } catch (error) {
      console.error(`Error when trying to reset password`, error)

      trackEvent(CATEGORY.auth, ACTION.auth.resetMdp, `: Error (${error?.status})`)
      setStatus({ message: "Erreur serveur", type: "error" })
    }
  }

  const { ref: firstValueRef, ...firstValueReg } = register("firstValue", {
    pattern: {
      value: /^(?=.{12,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/,
    },
    required: true,
  })
  const { ref: confirmedValueRef, ...confirmedValueReg } = register("confirmedValue", {
    required: true,
    validate: (value) => {
      return value === watch("firstValue")
    },
  })

  const handleChangeFirstValue = (e) => {
    setPassword(e.target.value)
  }

  return (
    <Layout>
      <Container style={{ maxWidth: 720 }} className="mt-5 mb-4">
        <Title1>{"Changement de mot de passe"}</Title1>
        {status?.message && <StatusAlert {...status} />}
        {showForm ? (
          <Form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <FormGroup row>
              <Label for="firstValue" sm={4}>
                Mot de passe
              </Label>
              <Col sm={8}>
                <Input
                  type="password"
                  id="firstValue"
                  {...firstValueReg}
                  innerRef={firstValueRef}
                  invalid={!!formErrors.firstValue}
                  aria-required="true"
                  onChange={e => {
                    firstValueReg.onChange(e)
                    handleChangeFirstValue(e);
                  }}
                />
                <PasswordForce password={password}></PasswordForce>
                <FormFeedback>
                  {formErrors.firstValue && "Mot de passe invalide. Le mot de passe doit être composé d'au moins 12 caractères dont: 1 lettre minuscule, 1 lettre majuscule, 1 chiffre et 1 caractère spécial."}
                </FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="confirmedValue" sm={4}>
                Confirmation mot de passe
              </Label>
              <Col sm={8}>
                <Input
                  type="password"
                  id="confirmedValue"
                  {...confirmedValueReg}
                  innerRef={confirmedValueRef}
                  invalid={!!formErrors.confirmedValue}
                  aria-required="true"
                />
                <FormFeedback>{formErrors.confirmedValue && "Les mots de passe ne correspondent pas."}</FormFeedback>
              </Col>
            </FormGroup>
            <div className="justify-content-center d-flex">
              <Link href="/administration/users">
                <Button className="px-4 mt-5 mr-3" outline color="primary">
                  Annuler
                </Button>
              </Link>
              <Button className="px-4 mt-5 " color="primary" onClick={handleSubmit(onSubmit)}>
                Appliquer
              </Button>
            </div>
          </Form>
        ) : (
          <div className="justify-content-center d-flex">
            <Link href="/">
              <Button className="px-4 mt-5 " color="primary">
                Se connecter
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </Layout>
  )
}

// This page need to call getInitialProps to have acess to variable like API_URL (see next.config.js for detail)
UserReset.getInitialProps = async () => {
  return {}
}

export default UserReset
