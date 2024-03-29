import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import PropTypes from "prop-types"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Alert, Button, Col, Container, Form, FormFeedback, FormGroup, Input, Label } from "reactstrap"

import { findUser, resetPasswordByAdmin } from "../../../../clients/users"
import Layout from "../../../../components/Layout"
import { Title1 } from "../../../../components/StyledComponents"
import { PasswordForce } from "../../../../components/PasswordForce"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../../utils/auth"
import { logDebug, logError } from "../../../../utils/logger"
import { isEmpty } from "../../../../utils/misc"
import { ADMIN } from "../../../../utils/roles"

const UserReset = ({initialUser = {}, currentUser, error: initialError}) => {
  const {
    handleSubmit,
    register,
    formState: { errors: formErrors },
    watch,
  } = useForm()
  const [error, setError] = useState("")
  const [success, setsuccess] = useState("")
  const router = useRouter()
  const { id } = router.query
  
  const [password, setPassword] = useState("")

  const onSubmit = async (data) => {
    setError("")
    try {
      if (isEmpty(formErrors)) {
        const { modified } = await resetPasswordByAdmin({ id, password: data.firstValue })
        logDebug(`Nb modified rows: ${modified}`)
        setsuccess("Mot de passe mis à jour.")
      }
    } catch (error) {
        setError("Erreur serveur")
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
    <Layout currentUser={currentUser} admin={true}>
      <Head>
        <title>Réinitialiser le mot de passe de cet utilisateur - Medlé</title>
      </Head>
      <Container style={{ maxWidth: 720 }} className="mt-5 mb-4">
        <Title1>{"Réinitialiser le mot de passe de cet utilisateur"}</Title1>

        {error && <Alert color="danger mt-4">{error}</Alert>}

        {success && (
          <Alert color="success" className="d-flex justify-content-between align-items-center mt-4">
            {success}&nbsp;
            <Link href="/administration/users">
              <Button className="" color="primary">
                Retour à la liste
              </Button>
            </Link>
          </Alert>
        )}

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
                onChange={e => {
                  firstValueReg.onChange(e)
                  handleChangeFirstValue(e);
                }}
                aria-required="true"
              />
              {
                  password != "" &&
                  <PasswordForce password={password}></PasswordForce>
              }
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
              Valider
            </Button>
          </div>
        </Form>
      </Container>
    </Layout>
  )
}

UserReset.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)

  const { id } = ctx.query

  // Initialise key prop with a fresh new value, to make possible to have a new blank page
  // see https://kentcdodds.com/blog/understanding-reacts-key-prop
  if (!id || isNaN(id)) return { initialUser: {}, key: Number(new Date()) }

  try {
    const user = await findUser({ id, headers })
    return { initialUser: user }
  } catch (error) {
    logError(error)
    redirectIfUnauthorized(error, ctx)

    return { error: "Erreur serveur" }
  }
}

UserReset.propTypes = {
  currentUser: PropTypes.object.isRequired,
  initialUser: PropTypes.object,
}

export default withAuthentication(UserReset, ADMIN)
