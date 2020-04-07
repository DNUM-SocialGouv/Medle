import React, { useState } from "react"
import Link from "next/link"
import PropTypes from "prop-types"
import {
   Collapse,
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
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import ApartmentIcon from "@material-ui/icons/Apartment"
import AccountBalanceIcon from "@material-ui/icons/AccountBalance"
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter"
import WhatshotIcon from "@material-ui/icons/Whatshot"
import ReceiptIcon from "@material-ui/icons/Receipt"
import FaceIcon from "@material-ui/icons/Face"

import { Footer } from "./Layout"
import { logout } from "../utils/auth"
import { isAllowed, ADMIN, ACT_CONSULTATION, EMPLOYMENT_CONSULTATION } from "../utils/roles"

const Header = ({ currentUser }) => {
   const [isOpen, setIsOpen] = useState(false)

   const toggle = () => setIsOpen(!isOpen)

   return (
      <header style={{ border: "1px solid #9c27b0" }}>
         <Navbar expand="md" className="justify-content-between align-items-center" light>
            <NavbarBrand>
               <img src={"/images/logo.png"} alt="Logo" title="Logo" width="100"></img>
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            {currentUser && (
               <Collapse isOpen={isOpen} navbar>
                  <Nav
                     className="ml-auto d-flex justify-content-end align-items-md-center align-items-start mt-2 pt-2 pt-md-0"
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

const Sidebar = ({ page, currentUser }) => {
   if (!currentUser) return ""
   return (
      <>
         <div className="list-group list-group-flush text-center">
            {isAllowed(currentUser.role, ADMIN) && (
               <Link href="/administration/users">
                  <a
                     className={
                        "list-group-item list-group-item-action " + (page === "users" ? "selected" : "unselected")
                     }
                  >
                     <FaceIcon className="text-black-50" width={30} />

                     <br />
                     {"Utilisateurs"}
                  </a>
               </Link>
            )}
            {currentUser.role == "SUPER_ADMIN" && (
               <Link href="/administration/hospitals">
                  <a
                     className={
                        "list-group-item list-group-item-action " + (page === "actsList" ? "selected" : "unselected")
                     }
                  >
                     <ApartmentIcon width={30} /> <br />
                     {"Établissements"}
                  </a>
               </Link>
            )}
            {currentUser.role == "SUPER_ADMIN" && (
               <Link href="/administration/askers">
                  <a
                     className={
                        "list-group-item list-group-item-action " +
                        (page === "fillEmployments" ? "selected" : "unselected")
                     }
                  >
                     <AccountBalanceIcon width={30} /> <br />
                     {"Demandeurs"}
                  </a>
               </Link>
            )}
            {currentUser.role == "SUPER_ADMIN" && (
               <Link href="/administration/attacks">
                  <a
                     className={
                        "list-group-item list-group-item-action " +
                        (page === "fillEmployments" ? "selected" : "unselected")
                     }
                  >
                     <WhatshotIcon width={30} /> <br />
                     {"Attentats"}
                  </a>
               </Link>
            )}
            {currentUser.role == "SUPER_ADMIN" && (
               <Link href="/administration/employments">
                  <a
                     className={
                        "list-group-item list-group-item-action " +
                        (page === "fillEmployments" ? "selected" : "unselected")
                     }
                  >
                     <BusinessCenterIcon width={30} /> <br />
                     {"Emplois"}
                  </a>
               </Link>
            )}
            {currentUser.role == "SUPER_ADMIN" && (
               <Link href="/administration/acts">
                  <a
                     className={
                        "list-group-item list-group-item-action " +
                        (page === "fillEmployments" ? "selected" : "unselected")
                     }
                  >
                     <ReceiptIcon width={30} /> <br />
                     {"Actes"}
                  </a>
               </Link>
            )}
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
