import React, { useState } from "react"
import Link from "next/link"
import PropTypes from "prop-types"
import {
   Collapse,
   Container,
   Col,
   Row,
   Nav,
   Navbar,
   NavbarBrand,
   NavbarToggler,
   UncontrolledDropdown,
   DropdownToggle,
   DropdownMenu,
   DropdownItem,
} from "reactstrap"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted"
import EqualizerIcon from "@material-ui/icons/Equalizer"
import PhoneIcon from "@material-ui/icons/Phone"
import SettingsIcon from "@material-ui/icons/Settings"
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary"
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"

import { logout } from "../utils/auth"
import { colors } from "../theme"
import { isAllowed, ACT_MANAGEMENT, ACT_CONSULTATION, EMPLOYMENT_CONSULTATION } from "../utils/roles"

const Header = ({ currentUser }) => {
   const [isOpen, setIsOpen] = useState(false)

   const toggle = () => setIsOpen(!isOpen)

   return (
      <header>
         <Navbar expand="md" className="navbar-medle">
            <NavbarBrand>
               <img src={"/images/logo.png"} alt="Logo" title="Logo"></img>
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
               <Nav className="ml-auto d-flex align-items-center" navbar>
                  <NotificationsNoneIcon className="mr-2 medle-icons" width={"30px"} />
                  <UncontrolledDropdown nav inNavbar>
                     <DropdownToggle nav>
                        <AccountCircleIcon className="medle-icons" width={30}>
                           Mon compte&nbsp;
                        </AccountCircleIcon>
                     </DropdownToggle>

                     <DropdownMenu right>
                        {currentUser && (
                           <DropdownItem>{currentUser.firstName + " " + currentUser.lastName} </DropdownItem>
                        )}
                        <DropdownItem divider />
                        <Link href="/profile">
                           <a>
                              <DropdownItem>Profil</DropdownItem>
                           </a>
                        </Link>
                        <DropdownItem>Administration</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={logout}>Se déconnecter</DropdownItem>
                     </DropdownMenu>
                  </UncontrolledDropdown>
               </Nav>
            </Collapse>
         </Navbar>
         <style jsx global>{`
            .medle-icons {
               color: #9b9b9b;
               font-size: 30px !important;
            }
            header {
               border-bottom: 1px solid #f3f3f3;
            }
            img[alt="Logo"] {
               width: 100px;
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
            .menu-link,
            .menu-link:hover,
            .menu-link:link,
            .menu-link:visited,
            .menu-link:active {
               border: 0;
               color: ${colors.header.color} !important;
               text-decoration: none;
               background-color: ${colors.header.background} !important;
            }
            header .dropdown-item {
               color: ${colors.header.color} !important;
               text-decoration: none;
               background-color: ${colors.header.background} !important;
            }
         `}</style>
      </header>
   )
}

Header.propTypes = {
   currentUser: PropTypes.object,
}

const Footer = () => (
   <footer>
      <Container>
         <Row>
            <Col>
               <h4>Medle.fabrique.social.gouv.fr</h4>
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
                  {" l'incubateur des ministères sociaux"}
               </a>
            </Col>
            <Col>
               <ul>
                  <li>
                     <Link href={"/conditions"}>
                        <a>{"Conditions générales d'utilisation"}</a>
                     </Link>
                  </li>
                  <li>
                     <Link href={"/statistics"}>
                        <a>Statistiques</a>
                     </Link>
                  </li>
                  <li>
                     <Link href={"/contact"}>
                        <a>Contactez-nous</a>
                     </Link>
                  </li>
               </ul>
            </Col>
         </Row>
      </Container>
      <style jsx>{`
         footer {
            margin: 50px 0 0;
            padding: 30px 30px 40px;
            background-color: ${colors.footer.background};
            color: ${colors.footer.color};
         }
         footer a,
         footer a:hover {
            color: ${colors.footer.color};
         }
         ul {
            list-style-type: none;
         }
      `}</style>
   </footer>
)

const Sidebar = ({ page, currentUser }) => {
   return (
      <>
         <div className="list-group list-group-flush text-center">
            {isAllowed(currentUser.role, ACT_MANAGEMENT) && (
               <Link href="/actDeclaration">
                  <a
                     className={
                        "list-group-item list-group-item-action " +
                        (page === "actDeclaration" ? "selected" : "unselected")
                     }
                  >
                     <AddCircleOutlineIcon width={30} />
                     <br />
                     {"Ajout d'acte"}
                  </a>
               </Link>
            )}
            {isAllowed(currentUser.role, ACT_CONSULTATION) && (
               <Link href="/actsList">
                  <a
                     className={
                        "list-group-item list-group-item-action " + (page === "actsList" ? "selected" : "unselected")
                     }
                  >
                     <FormatListBulletedIcon width={30} /> <br />
                     {"Tous les actes"}
                  </a>
               </Link>
            )}
            {isAllowed(currentUser.role, EMPLOYMENT_CONSULTATION) && (
               <Link href="/fillEmployments">
                  <a
                     className={
                        "list-group-item list-group-item-action " +
                        (page === "fillEmployments" ? "selected" : "unselected")
                     }
                  >
                     <FormatListBulletedIcon width={30} /> <br />
                     {"Personnel"}
                  </a>
               </Link>
            )}
            <Link href="/_error">
               <a className="list-group-item list-group-item-action">
                  <EqualizerIcon width={30} /> <br />
                  {"Statistiques"}
               </a>
            </Link>
            <Link href="/_error">
               <a className="list-group-item list-group-item-action">
                  <PhoneIcon width={30} /> <br />
                  {"Annuaire"}
               </a>
            </Link>
            <Link href="/_error">
               <a className="list-group-item list-group-item-action">
                  <LocalLibraryIcon width={30} /> <br />
                  {"Ressources"}
               </a>
            </Link>
            <Link href="/_error">
               <a className="list-group-item list-group-item-action">
                  <SettingsIcon width={30} /> <br />
                  {"Paramètres"}
               </a>
            </Link>
         </div>
         <style jsx>{`
            a {
               font-variant: small-caps;
               font-size: 12px;
               font-family: "Source Sans Pro";
               color: #9b9b9b;
            }
            a.selected {
               border-left: 5px solid #307df6;
               background-color: #e7f1fe !important;
            }
            a.unselected {
               border-left: 5px solid #fff;
            }
         `}</style>
      </>
   )
}

Sidebar.propTypes = {
   page: PropTypes.string,
   currentUser: PropTypes.object,
}

const Layout = ({ children, page, currentUser }) => {
   return (
      <>
         <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", justifyContent: "space-between" }}>
            <Header currentUser={currentUser} />
            <div id="wrapper" className="d-flex">
               <div id="sidebar-wrapper" className="border-right">
                  <Sidebar page={page} currentUser={currentUser} />
               </div>
               <div id="page-content-wrapper">
                  <main style={{ flexGrow: 1 }}>{children}</main>
               </div>
            </div>
            <Footer />
         </div>
         <style jsx>{`
            #sidebar-wrapper {
               min-height: 100vh;
               width: 140px;
               margin-left: -15rem;
               -webkit-transition: margin 0.25s ease-out;
               -moz-transition: margin 0.25s ease-out;
               -o-transition: margin 0.25s ease-out;
               transition: margin 0.25s ease-out;
            }

            #sidebar-wrapper .sidebar-heading {
               padding: 0.875rem 1.25rem;
               font-size: 1.2rem;
            }

            #page-content-wrapper {
               min-width: 100vw;
            }

            #wrapper.toggled #sidebar-wrapper {
               margin-left: 0;
            }

            @media (min-width: 768px) {
               #sidebar-wrapper {
                  margin-left: 0;
               }

               #page-content-wrapper {
                  min-width: 0;
                  width: 100%;
               }

               #wrapper.toggled #sidebar-wrapper {
                  margin-left: -15rem;
               }
            }
         `}</style>
      </>
   )
}

Layout.propTypes = { children: PropTypes.node.isRequired, page: PropTypes.string, currentUser: PropTypes.object }

export default Layout
