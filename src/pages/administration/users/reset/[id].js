import Link from "next/link"
import { useRouter } from "next/router"
import PropTypes from "prop-types"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Alert, Button, Col, Container, Form, FormFeedback, FormGroup, Input, Label } from "reactstrap"

import { resetPasswordByAdmin } from "../../../../clients/users"
import Layout from "../../../../components/Layout"
import { Title1 } from "../../../../components/StyledComponents"
import { withAuthentication } from "../../../../utils/auth"
import { logDebug } from "../../../../utils/logger"
import { isEmpty } from "../../../../utils/misc"
import { ADMIN } from "../../../../utils/roles"

const UserReset = ({ currentUser }) => {
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
      value: /^[a-zA-Z0-9]{8,30}$/,
    },
    required: true,
  })
  const { ref: confirmedValueRef, ...confirmedValueReg } = register("confirmedValue", {
    required: true,
    validate: (value) => {
      return value === watch("firstValue")
    },
  })

  return (
    <Layout currentUser={currentUser} admin={true}>
      <Container style={{ maxWidth: 720 }} className="mt-5 mb-4">
        <Title1>{"Utilisateur"}</Title1>

        {error && <Alert color="danger mt-4">{error}</Alert>}

        {success && (
          <Alert color="success" className="d-flex justify-content-between align-items-center mt-4">
            {success}&nbsp;
            <Link href="/administration/users">
              <Button className="" outline color="success">
                <a>Retour à la liste</a>
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
                aria-required="true"
              />
              <FormFeedback>
                {formErrors.firstValue && "Mot de passe invalide (8 à 30 caractères avec lettres ou chiffres)."}
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
              Mettre à jour
            </Button>
          </div>
        </Form>
      </Container>
    </Layout>
  )
}

UserReset.propTypes = {
  currentUser: PropTypes.object.isRequired,
  initialUser: PropTypes.object,
}

export default withAuthentication(UserReset, ADMIN)
