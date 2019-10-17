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
// import LockIcon from "@material-ui/icons/Lock"
import { colors } from "../theme"

const Header = () => {
   const [isOpen, setIsOpen] = useState(false)

   const toggle = () => setIsOpen(!isOpen)

   return (
      <header>
         <Navbar color="light" light expand="md" className="navbar-medle">
            <NavbarBrand href="/">
               <img src={"/images/logo.png"} alt="Logo MedLé" title="Logo MedLé" width="100"></img>&nbsp; Plateforme de
               médecine légale
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
               <Nav className="ml-auto" navbar>
                  <NavItem>
                     <NavLink href="/aide/">Aide</NavLink>
                  </NavItem>
                  <UncontrolledDropdown nav inNavbar>
                     <Button outline className="account">
                        <DropdownToggle nav caret>
                           Mon compte&nbsp;
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
         <style jsx global>{`
            header {
               border-bottom: 1px solid #f3f3f3;
            }
            .navbar-medle button.account {
               padding: 0;
            }
            .navbar-medle button.account:hover {
               background-color: ${colors.header.background} !important;
            }

            .navbar-medle .navbar-brand {
               color: ${colors.header.color} !important;
            }
            .navbar-medle .nav-link {
               color: ${colors.header.color} !important;
            }
         `}</style>
      </header>
   )
}

const Footer = () => (
   <footer>
      <Container>
         <Row>
            <Col>
               <h4>Medle.incubateur.social.gouv.fr</h4>
               Un service proposé par la{" "}
               <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://solidarites-sante.gouv.fr/ministere/organisation/directions/article/dgos-direction-generale-de-l-offre-de-soins"
               >
                  DGOS
               </a>{" "}
               et{" "}
               <a target="_blank" href="https://incubateur.social.gouv.fr/" rel="noopener noreferrer">
                  {" l'incubateur des Affaires sociales"}
               </a>
            </Col>
            <Col>
               <ul style={{ listStyleType: "none" }}>
                  <li>
                     <Link href={"/"}>{"Conditions générales d'utilisation"}</Link>
                  </li>
                  <li>
                     <Link href={"/"}>Statistiques</Link>
                  </li>
                  <li>
                     <Link href={"/"}>Contactez-nous</Link>
                  </li>
               </ul>
            </Col>
         </Row>
      </Container>
      <style jsx global>{`
         footer {
            background-color: ${colors.footer.background};
            color: ${colors.footer.color};
            margin: 50px 0 0;
            padding: 30px 30px 40px;
         }
         footer a,
         footer a:hover {
            color: ${colors.footer.color};
         }
      `}</style>
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
