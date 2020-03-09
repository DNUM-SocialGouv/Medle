import React from "react"
import { PropTypes } from "prop-types"
import Layout from "../components/Layout"
import { Container, Col, Row } from "reactstrap"
import { withAuthentication } from "../utils/auth"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import { ROLES_DESCRIPTION } from "../utils/roles"
import { capitalize } from "../utils/misc"

const ProfilePage = ({ currentUser }) => {
   const { id, firstName, lastName, email, role, hospitalName, scope } = currentUser
   return (
      <Layout currentUser={currentUser}>
         <Container style={{ maxWidth: 500 }}>
            <div
               className="mt-5 pt-5 pb-4 pl-4 pr-4"
               style={{
                  boxShadow: "5px 5px 5px #d3d3d3",
                  border: "1px solid #eee",
                  borderRadius: "10px",
               }}
            >
               <Row>
                  <div style={{ width: "100%", textAlign: "center" }}>
                     <AccountCircleIcon
                        className="account-icon ml-4"
                        style={{ marginTop: -120, marginLeft: 25 }}
                        width={100}
                     />
                  </div>
                  <Col sm="4" title={`id #${id}`} style={{ textTransform: "uppercase" }}>
                     {"Données de l'utilisateur"}
                  </Col>
                  <Col sm="8" className="pl-4" style={{ borderLeft: "1px solid #d3d3d3" }}>
                     <Row>
                        <Col style={{ fontWeight: "600" }}>
                           {capitalize(firstName)} {capitalize(lastName)}
                        </Col>
                     </Row>
                     <Row className="mt-1">
                        <Col>{email}</Col>
                     </Row>
                     <Row className="mt-3">
                        <Col>
                           <span
                              style={{
                                 backgroundColor: "#b2f5ea",
                                 borderRadius: "0.25rem",
                                 color: "#2c7a7b",
                                 padding: "0.25rem 0.5rem",
                              }}
                           >
                              {role && ROLES_DESCRIPTION[role] ? ROLES_DESCRIPTION[role] : "N/A"}
                           </span>
                        </Col>
                     </Row>
                     {hospitalName && (
                        <Row className="mt-3">
                           <Col>{hospitalName}</Col>
                        </Row>
                     )}
                     {scope && scope.length && (
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
