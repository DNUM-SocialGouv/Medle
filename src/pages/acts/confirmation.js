import Add from "@material-ui/icons/Add"
import Link from "next/link"
import { useRouter } from "next/router"
import { PropTypes } from "prop-types"
import React, { useEffect } from "react"
import { Container, Row } from "reactstrap"

import Layout from "../../components/Layout"
import { Button, Title1 } from "../../components/StyledComponents"
import { withAuthentication } from "../../utils/auth"
import { ACT_MANAGEMENT } from "../../utils/roles"

const ActConfirmationPage = ({ currentUser }) => {
  const router = useRouter()
  const { internalNumber, pvNumber, edit } = router.query
  const pvText = pvNumber && `(PV: ${pvNumber}) `

  useEffect(() => {
    document.body.focus()
    window.scrollTo(0, 0)
  })

  return (
    <Layout currentUser={currentUser}>
      <Container>
        <Title1 className="mt-5">{`L'acte #${internalNumber} ${pvText}a été ${edit ? "modifié" : "ajouté"}.`}</Title1>

        <Row className="mt-5">
          <Link href="/acts/declaration">
            <Button className="mx-auto" primary="true">
              <Add /> Ajouter un nouvel acte
            </Button>
          </Link>
        </Row>

        <Row className="mt-5">
          <Link href="/acts" className="mx-auto">
            Retour à la liste des actes
          </Link>
        </Row>
      </Container>
    </Layout>
  )
}

ActConfirmationPage.propTypes = {
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(ActConfirmationPage, ACT_MANAGEMENT)
