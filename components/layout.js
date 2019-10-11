import React, { useState } from "react"
import Link from "next/link"
import PropTypes from "prop-types"
import {
   Button,
   Collapse,
   Container,
   Col,
   Row,
   Nav,
   NavItem,
   Navbar,
   NavLink,
   NavbarBrand,
   NavbarToggler,
   UncontrolledDropdown,
   DropdownToggle,
   DropdownMenu,
   DropdownItem,
} from "reactstrap"
import LockIcon from "@material-ui/icons/Lock"
import colors from "../constants/colors"

const Header = () => {
   const [headerData, setHeaderData] = useState(false)

   const toggle = () => {
      setHeaderData(!this.state.isOpen)
   }

   return (
      <header>
         <div style={{ backgroundColor: "white" }}>
            <Container>
               <Row>
                  <Col>
                     <Navbar expand="md">
                        <NavbarBrand href="/">
                           <img src={"/images/logo.png"} alt="Medlé logo" width="100"></img>
                        </NavbarBrand>
                        <NavbarToggler onClick={toggle} />
                        <Collapse isOpen={headerData} navbar>
                           <Nav className="ml-auto" navbar>
                              <NavItem>
                                 <NavLink href="/components/">Actes médico-légales</NavLink>
                              </NavItem>
                              <NavItem>
                                 <NavLink href="https://github.com/reactstrap/reactstrap">ETP</NavLink>
                              </NavItem>
                              <NavItem>
                                 <NavLink href="https://github.com/reactstrap/reactstrap">Statistiques</NavLink>
                              </NavItem>
                              <UncontrolledDropdown nav inNavbar>
                                 <Button outline color="primary">
                                    <DropdownToggle nav caret>
                                       <LockIcon></LockIcon>
                                       &nbsp;Compte
                                    </DropdownToggle>
                                 </Button>
                                 <DropdownMenu right>
                                    <DropdownItem>Profil</DropdownItem>
                                    <DropdownItem>Administration</DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem>Se déconnecter</DropdownItem>
                                 </DropdownMenu>
                              </UncontrolledDropdown>
                           </Nav>
                        </Collapse>
                     </Navbar>
                  </Col>
               </Row>
            </Container>
         </div>
      </header>
   )
}

const Footer = () => (
   <footer style={{ backgroundColor: colors.bgFooter, color: "white", padding: 30 }}>
      <Container>
         <Row>
            <Col>
               <h4>Medle.incubateur.social.gouv.fr</h4>
               Un service proposé par la DGOS
            </Col>
            <Col>
               <ul style={{ listStyleType: "none" }}>
                  <li>
                     <Link>{"Conditions générales d'utilisation"}</Link>
                  </li>
                  <li>
                     <Link>Statistiques</Link>
                  </li>
                  <li>
                     <Link>Contactez-nous</Link>
                  </li>
               </ul>
            </Col>
         </Row>
      </Container>
   </footer>
)

const Layout = ({ children }) => (
   <>
      <Header />
      <main>{children}</main>
      <Footer />
   </>
)

Layout.propTypes = { children: PropTypes.node.isRequired }

export default Layout
