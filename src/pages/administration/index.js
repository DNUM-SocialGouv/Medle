import React, { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { PropTypes } from "prop-types"
import Layout from "../../components/Layout"
import { Container, Row } from "reactstrap"
import { Button, Title1 } from "../../components/StyledComponents"
import Add from "@material-ui/icons/Add"
import { withAuthentication } from "../../utils/auth"
import { ACT_MANAGEMENT } from "../../utils/roles"

const IndexPage = ({ currentUser }) => {
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
          <Link href="/acts">
            <a className="mx-auto">Retour à la liste des actes</a>
          </Link>
        </Row>
      </Container>
    </Layout>
  )
}

IndexPage.propTypes = {
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(IndexPage, ACT_MANAGEMENT)
