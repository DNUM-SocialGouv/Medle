import React from "react"
import { PropTypes } from "prop-types"
import { Container } from "reactstrap"

import { ADMIN } from "../../utils/roles"
import Layout from "../../components/Layout"
import { Title1 } from "../../components/StyledComponents"
import { withAuthentication } from "../../utils/auth"

const MessagePage = ({ currentUser }) => {
  return (
    <Layout page="employments" currentUser={currentUser} admin={true}>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1 className="">{"Administration des messages"}</Title1>
      </Container>
    </Layout>
  )
}

MessagePage.propTypes = {
  paginatedData: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(MessagePage, ADMIN)
