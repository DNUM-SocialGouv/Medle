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
   NavItem,
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
import GroupIcon from "@material-ui/icons/Group"

import { logout } from "../utils/auth"
import { colors } from "../theme"
import { isAllowed, ACT_MANAGEMENT, ACT_CONSULTATION, EMPLOYMENT_CONSULTATION } from "../utils/roles"

const Header = ({ currentUser }) => {
   const [isOpen, setIsOpen] = useState(false)

   const toggle = () => setIsOpen(!isOpen)

   return (
      <header className="border-bottom">
         <Navbar expand="md" light>
            <NavbarBrand>
               <img src={"/images/logo.png"} alt="Logo" title="Logo" width="100"></img>
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            {currentUser && (
               <Collapse isOpen={isOpen} navbar>
                  <Nav
                     className="pt-2 mt-2 ml-auto d-flex justify-content-end align-items-md-center align-items-start pt-md-0"
                     navbar
                  >
                     <NavItem className="">
                        <NotificationsNoneIcon className="mr-2 text-black-50" width={30} />
                        <span className="d-sm-inline d-md-none text-black-50">Notifs</span>
                     </NavItem>
                     <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav>
                           <AccountCircleIcon className="text-black-50" width={30} />
                           <span className="d-sm-inline d-md-none text-black-50">&nbsp;Mon compte</span>
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
            )}
         </Navbar>
      </header>
   )
}

Header.propTypes = {
   currentUser: PropTypes.object,
}

const Footer = () => (
   <footer className="pt-4 pb-5 m-0">
      <Container>
         <Row>
            <Col className="mr-5">
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
            <Col className="mt-4 mt-md-0">
               <ul className="pl-0 list-unstyled">
                  {/* <li>
                     <Link href={"/conditions"}>
                        <a>{"Conditions générales d'utilisation"}</a>
                     </Link>
                  </li> */}
                  <li>
                     <Link href={"/statistics"}>
                        <a>Statistiques</a>
                     </Link>
                  </li>
                  <li>
                     {/* <Link> */}
                     <a href="mailto:contact.medle@fabrique.social.gouv.fr">Contactez&#8209;nous</a>
                     {/* </Link> */}
                  </li>
                  <li>
                     <Link href={"/faq"}>
                        <a>FAQ</a>
                     </Link>
                  </li>
               </ul>
            </Col>
         </Row>
      </Container>
      <style jsx>{`
         footer {
            background-color: ${colors.footer.background};
            color: ${colors.footer.color};
         }
         footer a,
         footer a:hover {
            color: ${colors.footer.color};
         }
      `}</style>
   </footer>
)

const Sidebar = ({ page, currentUser }) => {
   if (!currentUser) return ""
   return (
      <>
         <div className="text-center list-group list-group-flush">
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
                     <GroupIcon width={30} /> <br />
                     {"Personnel"}
                  </a>
               </Link>
            )}
            <Link href="/statistics">
               <a
                  className={
                     "list-group-item list-group-item-action " + (page === "statistics" ? "selected" : "unselected")
                  }
               >
                  <EqualizerIcon width={30} /> <br />
                  {"Statistiques"}
               </a>
            </Link>
            {/* <Link href="/_error"> */}
            <a className="list-group-item list-group-item-action">
               <PhoneIcon width={30} /> <br />
               {"Annuaire"}
            </a>
            {/* </Link> */}
            {/* <Link href="/_error"> */}
            <a className="list-group-item list-group-item-action">
               <LocalLibraryIcon width={30} /> <br />
               {"Ressources"}
            </a>
            {/* </Link> */}
            {/* <Link href="/_error"> */}
            <a className="list-group-item list-group-item-action">
               <SettingsIcon width={30} /> <br />
               {"Paramètres"}
            </a>
            {/* </Link> */}
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
         <div className="d-flex flex-column justifiy-content-between min-vh-100">
            <Header currentUser={currentUser} />
            <div id="wrapper" className="d-flex">
               <div id="sidebar-wrapper" className="border-right">
                  <Sidebar page={page} currentUser={currentUser} />
               </div>
               <div id="page-content-wrapper">
                  <main className="pb-5">{children}</main>
               </div>
            </div>
            <Footer />
         </div>
         <style jsx>{`
            #sidebar-wrapper {
               min-height: 100vh;
               width: 140px;
            }

            #sidebar-wrapper .sidebar-heading {
               padding: 0.875rem 1.25rem;
               font-size: 1.2rem;
            }

            #page-content-wrapper {
               min-width: calc(100vw - 140px);
            }
         `}</style>
      </>
   )
}

Layout.propTypes = { children: PropTypes.node.isRequired, page: PropTypes.string, currentUser: PropTypes.object }

export default Layout
