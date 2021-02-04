import { PropTypes } from "prop-types"
import React from "react"
import { Alert, Container } from "reactstrap"

import Layout from "../components/Layout"
import { Title1 } from "../components/StyledComponents"
import { withAuthentication } from "../utils/auth"

const PermissionErrorPage = ({ currentUser }) => {
  return (
    <Layout currentUser={currentUser}>
      <Container style={{ maxWidth: 720 }}>
        <Title1 className="mt-5 mb-5">Erreur</Title1>
        <Alert color="danger">{"Vous n'avez pas les droits requis pour accèder à cette page."}</Alert>
      </Container>
    </Layout>
  )
}

PermissionErrorPage.propTypes = {
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(PermissionErrorPage)
