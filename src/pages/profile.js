import React from "react"
import { PropTypes } from "prop-types"
import Layout from "../components/Layout"
import { Container, Col, Row } from "reactstrap"
import { Title1 } from "../components/StyledComponents"
import { withAuthentication } from "../utils/auth"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import { ROLES_DESCRIPTION } from "../utils/roles"
import { capitalize } from "../utils/misc"

const ProfilePage = ({ currentUser }) => {
   const { id, firstName, lastName, email, role, hospitalId, scope } = currentUser
   return (
      <Layout currentUser={currentUser}>
         <Container style={{ maxWidth: 500 }}>
            <Title1 className="mt-5 mb-5">Profil</Title1>
            <div style={{ boxShadow: "5px 5px 5px #d3d3d3", border: "1px solid #eee", borderRadius: "10px" }}>
               <Row className="pt-4 pb-4">
                  <Col sm="4" title={`id #${id}`}>
                     <AccountCircleIcon className="account-icon ml-4" width={100} />
                  </Col>
                  <Col sm="8">
                     <Row>
                        <Col>
                           {capitalize(firstName)} {capitalize(lastName)}
                        </Col>
                     </Row>
                     <Row className="mt-1">
                        <Col>{email}</Col>
                     </Row>
                     <Row className="mt-4">
                        <Col>
                           <i>Rôle</i>
                           <br />
                           {role && ROLES_DESCRIPTION[role] ? ROLES_DESCRIPTION[role] : "N/A"}
                        </Col>
                     </Row>
                     {hospitalId && (
                        <Row className="mt-4">
                           <Col>
                              <b>Hôpital de rattachement</b>
                              <br />
                              {hospitalId}
                           </Col>
                        </Row>
                     )}
                     {scope && scope.length && (
                        <Row className="mt-4">
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
