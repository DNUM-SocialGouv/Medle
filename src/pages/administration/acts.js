import { PropTypes } from "prop-types"
import React from "react"
import { Container } from "reactstrap"

import Layout from "../../components/Layout"
import { Title1 } from "../../components/StyledComponents"
import { withAuthentication } from "../../utils/auth"
import { ADMIN } from "../../utils/roles"

const ActsPage = ({ currentUser }) => {
  return (
    <Layout page="acts" currentUser={currentUser} admin={true}>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1 className="">{"Administration des actes"}</Title1>
      </Container>
    </Layout>
  )
}

ActsPage.propTypes = {
  paginatedData: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(ActsPage, ADMIN)
