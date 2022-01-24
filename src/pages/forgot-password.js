import Head from "next/head"
import Link from "next/link"
import React from "react"
import { Button, Col, Container, Form, FormGroup, Input, Label } from "reactstrap"

import { forgotPassword } from "../clients/users"
import Layout from "../components/Layout"
import StatusAlert from "../components/StatusAlert"
import { Title1 } from "../components/StyledComponents"
import { ACTION, CATEGORY, trackEvent } from "../utils/matomo"

const ForgotPasswordPage = () => {
  const [email, setEmail] = React.useState()
  const [showForm, setShowForm] = React.useState(true)

  const [status, setStatus] = React.useState({ type: "idle" })

  React.useEffect(() => {
    async function sendEmail() {
      if (status?.type !== "pending") {
        return
      }

      try {
        await forgotPassword(email)

        trackEvent(CATEGORY.auth, ACTION.auth.oubliMdp, `${email} : OK`)
        setStatus({ message: `Un courriel vous a été envoyé à ${email}.`, type: "success" })
        setShowForm(false)
      } catch (error) {
        console.error(`Error when trying to send email to ${email}`, error)

        trackEvent(CATEGORY.auth, ACTION.auth.oubliMdp, `${email} : Error (${error?.status})`)

        setStatus({
          message: error.status === 404 ? "Le courriel ne semble pas exister." : "Erreur lors de l'envoi du courriel",
          type: "error",
        })
      }
    }
    sendEmail()
  }, [status, email])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email) {
      setStatus({
        message: "Veuillez renseigner le champ Courriel.",
        type: "error",
      })
      return
    }

    setStatus({ type: "pending" })
  }

  function handleChange(event) {
    setStatus({ type: "idle" })
    const value = event?.target?.value

    setEmail(value)
  }

  return (
    <Layout>
      <Head>
        <title>Vous avez oublié votre mot de passe ? - Medlé</title>
      </Head>
      <Title1 className="mt-5">Vous avez oublié votre mot de passe ?</Title1>
      <Container style={{ maxWidth: 700 }}>
        <span>&nbsp;</span>

        {status?.message && <StatusAlert {...status} />}

        {showForm ? (
          <Form onSubmit={handleSubmit} className="mt-4">
            <FormGroup row>
              <Label for="email" sm={4}>
                Courriel
              </Label>
              <Col sm={8}>
                <Input type="email" name="email" id="email" onChange={handleChange} />
              </Col>
            </FormGroup>
            <div className="justify-content-center d-flex mt-4">
              <Link href="/">
                <Button className="px-4 mt-5 mr-3" outline color="primary">
                  Annuler
                </Button>
              </Link>
              <Button className="px-4 mt-5 " color="primary" disabled={status?.type === "pending"}>
                Envoyer un email
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <div className="justify-content-center d-flex mt-4">
              <Link href="/">
                <Button className="px-4 mt-5 mr-3" outline color="primary">
                  {"Retour à l'accueil"}
                </Button>
              </Link>
              <Button
                className="px-4 mt-5 "
                color="primary"
                disabled={status?.type === "pending"}
                onClick={() => setStatus({ type: "pending" })}
              >
                Envoyer à nouveau
              </Button>
            </div>
          </>
        )}
      </Container>
    </Layout>
  )
}

// This page need to call getInitialProps to have acess to variable like API_URL (see next.config.js for detail)
ForgotPasswordPage.getInitialProps = async () => {
  return {}
}

export default ForgotPasswordPage
