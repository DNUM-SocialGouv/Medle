import Head from "next/head"
import { useRouter } from "next/router"
import { PropTypes } from "prop-types"
import React from "react"
import { useForm } from "react-hook-form"
import { Button, Container, Form, FormFeedback, Input, Label } from "reactstrap"

import { updateLogo } from "../../../clients/logos"
import Layout from "../../../components/Layout"
import StatusAlert from "../../../components/StatusAlert"
import { Title1 } from "../../../components/StyledComponents"
import { withAuthentication } from "../../../utils/auth"
import { isEmpty } from "../../../utils/misc"
import { ADMIN } from "../../../utils/roles"

const AdminLogoPage = ({ currentUser }) => {
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors: formErrors },
  } = useForm()
  const [status, setStatus] = React.useState({ type: "idle" })

  const { ref: logoMinistereRef, ...logoMinistereReg } = register("logoMinistere", {
    required: true,
  })

  const onSubmit = async (data) => {
    setStatus({ type: "pending" })
    try {
      if (isEmpty(formErrors)) {
        if (data.logoMinistere[0].size / 1024 > 300) {
          setStatus({ message: "Le poids de l'image ne doit pas excéder 300 Ko.", type: "error" })
        } else {
          await updateLogo({ logo: data.logoMinistere[0] })
          router.reload(window.location.pathname)
        }
      }
    } catch (error) {
      console.error(`Error when trying to change logo`, error)
      setStatus({ message: "Erreur lors de l'enregistrement du logo.", type: "error" })
    }
  }

  return (
    <Layout page="logos" currentUser={currentUser} admin={true}>
      <Head>
        <title>Administration des logos - Medlé</title>
      </Head>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1 className="">{"Administration des logos"}</Title1>
      </Container>
      <Container>
        {status?.message && <StatusAlert {...status} />}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Label for="logoMinistere">Choix du logo ministère :</Label>
          <Input
            type="file"
            accept="image/*"
            {...logoMinistereReg}
            innerRef={logoMinistereRef}
            invalid={!!formErrors.logoMinistere}
            name="logoMinistere"
            id="logoMinistere"
          />
          <FormFeedback>{formErrors.logoMinistere && "Une image est requise."}</FormFeedback>
          <Button className="px-4 mt-5 " color="primary" onClick={handleSubmit(onSubmit)}>
            Appliquer
          </Button>
        </Form>
      </Container>
    </Layout>
  )
}

AdminLogoPage.propTypes = {
  currentUser: PropTypes.object.isRequired,
  logoMinistere: PropTypes.object,
}
AdminLogoPage.getInitialProps = async () => {
  return {}
}
export default withAuthentication(AdminLogoPage, ADMIN)
