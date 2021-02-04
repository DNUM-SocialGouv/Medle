import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import { PropTypes } from "prop-types"
import React from "react"
import { Col, Container, Row } from "reactstrap"

import Layout from "../components/Layout"
import { withAuthentication } from "../utils/auth"
import { capitalize } from "../utils/misc"
import { ROLES_DESCRIPTION } from "../utils/roles"

const ProfilePage = ({ currentUser }) => {
  const { id, firstName, lastName, email, role, hospital, scope } = currentUser
  return (
    <Layout currentUser={currentUser}>
      <Container style={{ maxWidth: 500 }}>
        <div className="pt-5 pb-4 pl-4 pr-4 mt-5 border rounded shadow border-light">
          <Row>
            <div className="text-center w-100">
              <AccountCircleIcon
                className="ml-4 account-icon"
                style={{ marginTop: -120, marginLeft: 25 }}
                width={100}
              />
            </div>
            <Col sm="4" title={`id #${id}`} className="text-uppercase">
              {"Données de l'utilisateur"}
            </Col>
            <Col sm="8" className="pl-4 border-left">
              <Row>
                <Col className="font-weight-bold">
                  {capitalize(firstName)} {capitalize(lastName)}
                </Col>
              </Row>
              <Row className="mt-1">
                <Col>{email}</Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <span
                    className="px-4 py-2 rounded"
                    style={{
                      backgroundColor: "#b2f5ea",
                      color: "#2c7a7b",
                    }}
                  >
                    {role && ROLES_DESCRIPTION[role] ? ROLES_DESCRIPTION[role] : "N/A"}
                  </span>
                </Col>
              </Row>
              {hospital && (
                <Row className="mt-3">
                  <Col>{hospital.name}</Col>
                </Row>
              )}
              {scope?.length && (
                <Row className="mt-3">
                  <Col>
                    <i>Périmètre</i>
                    <br />
                    {scope.join(", ")}
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </div>
        <style jsx global>{`
          .account-icon {
            color: #eeeeee;
            font-size: 100px !important;
          }
        `}</style>
      </Container>
    </Layout>
  )
}

ProfilePage.propTypes = {
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(ProfilePage)
