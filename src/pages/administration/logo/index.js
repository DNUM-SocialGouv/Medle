import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { PropTypes } from "prop-types"

import React, { useState } from "react"
import { Container, Form, Input, Button, Label, FormFeedback } from "reactstrap"
import { useForm } from "react-hook-form"

import { findLogo, updateLogo } from "../../../clients/logo"

import Layout from "../../../components/Layout"
import StatusAlert from "../../../components/StatusAlert"
import { Title1 } from "../../../components/StyledComponents"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../utils/auth"
import { logError } from "../../../utils/logger"
import { isEmpty } from "../../../utils/misc"
import { ADMIN } from "../../../utils/roles"

const LogoPage = ({ currentUser }) => {
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors: formErrors },
  } = useForm()
  const [status, setStatus] = React.useState({ type: "idle" })

  const { ref: logoRef, ...logoReg } = register("logo", {
    required: true,
  })

  const onSubmit = async (data) => {
    setStatus({ type: "pending" })
    try {
      if (isEmpty(formErrors)) {
        await updateLogo({ logo: data.logo[0] })
        router.reload(window.location.pathname)
      }
    } catch (error) {
      console.error(`Error when trying to change logo`, error)
      setStatus({ message: "Erreur à l'enregistrement du logo.", type: "error" })
    }
  }

  return (
    <Layout page="logo" currentUser={currentUser} admin={true}>
      <Head>
        <title>Administration du logo - Medlé</title>
      </Head>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1 className="">{"Administration du logo"}</Title1>
      </Container>
      <Container>
        {status?.message && <StatusAlert {...status} />}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Label for="logo">Choix du logo :</Label>
          <Input
            type="file"
            accept="image/*"
            {...logoReg}
            innerRef={logoRef}
            invalid={!!formErrors.logo}
            name="logo"
            id="logo"
          />
          <FormFeedback>
            {formErrors.logo && "Image requise."}
          </FormFeedback>
          <Link href="/statistics">
            <Button className="px-4 mt-5 mr-3" outline color="primary">
              Annuler
            </Button>
          </Link>
          <Button className="px-4 mt-5 " color="primary" onClick={handleSubmit(onSubmit)}>
            Appliquer
          </Button>
        </Form>
      </Container>
    </Layout>
  )
}

LogoPage.propTypes = {
  currentUser: PropTypes.object.isRequired,
  logo: PropTypes.object,
}
LogoPage.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)

  try {
    // const logo = await findLogo(headers)
    // return {
    //   logo,
    // }
  } catch (error) {
    logError("APP error", error)
    redirectIfUnauthorized(error, ctx)
  }

  return {}
}
export default withAuthentication(LogoPage, ADMIN)