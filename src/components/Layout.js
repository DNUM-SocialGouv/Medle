import AccountBalanceIcon from "@material-ui/icons/AccountBalance"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import AnnouncementIcon from "@material-ui/icons/Announcement"
import ApartmentIcon from "@material-ui/icons/Apartment"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import EqualizerIcon from "@material-ui/icons/Equalizer"
import FaceIcon from "@material-ui/icons/Face"
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted"
import GroupIcon from "@material-ui/icons/Group"
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary"
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone"
import PhoneIcon from "@material-ui/icons/Phone"
import ReceiptIcon from "@material-ui/icons/Receipt"
import SettingsIcon from "@material-ui/icons/Settings"
import WhatshotIcon from "@material-ui/icons/Whatshot"
import Link from "next/link"
import { useRouter } from "next/router"
import PropTypes from "prop-types"
import React, { useState } from "react"
import {
  Col,
  Collapse,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  Row,
  UncontrolledDropdown,
} from "reactstrap"

import { isOpenFeature } from "../config"
import { colors } from "../theme"
import { logout } from "../utils/auth"
import {
  ACT_CONSULTATION,
  ACT_MANAGEMENT,
  ADMIN,
  EMPLOYMENT_CONSULTATION,
  isAllowed,
  startPageForRole,
  SUPER_ADMIN,
} from "../utils/roles"

const Header = ({ currentUser }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <header className="border-bottom">
      <Navbar expand="md" light>
        <NavbarBrand onClick={() => router.push("/")}>
          <img src={"/images/logo.png"} alt="Logo" title="Logo" width="100" />
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        {currentUser && (
          <Collapse isOpen={isOpen} navbar>
            <Nav
              className="pt-2 mt-2 ml-auto d-flex justify-content-end align-items-md-center align-items-start pt-md-0"
              navbar
            >
              {isOpenFeature("notification") && (
                <NavItem className="">
                  <NotificationsNoneIcon className="mr-2 text-black-50" width={30} />
                  <span className="d-sm-inline d-md-none text-black-50">Notifs</span>
                </NavItem>
              )}
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle title="Menu vers mon compte" nav>
                  <AccountCircleIcon className="text-black-50" width={30} />
                  <span className="d-sm-inline d-md-none text-black-50">&nbsp;Mon compte</span>
                </DropdownToggle>

                <DropdownMenu right>
                  {currentUser && <DropdownItem>{currentUser.firstName + " " + currentUser.lastName} </DropdownItem>}
                  <DropdownItem divider />
                  <Link href="/profile">
                    <a>
                      <DropdownItem>Profil</DropdownItem>
                    </a>
                  </Link>
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

export const Footer = () => (
  <footer className="pt-4 pb-5 m-0">
    <Container>
      <Row>
        <Col className="mr-5">
          <h4>Medle.fabrique.social.gouv.fr</h4>
          Un service proposé par la{" "}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://solidarites-sante.gouv.fr/ministere/organisation/organisation-des-directions-et-services/article/organisation-de-la-direction-generale-de-l-offre-de-soins-dgos"
          >
            DGOS
          </a>{" "}
          (ministère de la santé) et{" "}
          <a target="_blank" href="https://www.fabrique.social.gouv.fr/" rel="noopener noreferrer">
            {"la fabrique numérique des ministères sociaux"}
          </a>{" "}
          (
          <a target="_blank" href="https://beta.gouv.fr/" rel="noopener noreferrer">
            beta.gouv.fr
          </a>
          )
        </Col>
        <Col className="mt-4 mt-md-0">
          <ul className="pl-0 list-unstyled">
            <li className="mb-2">
              <Link href={"/mentions"}>
                <a>{"Mentions légales"}</a>
              </Link>
            </li>
            <li className="mb-2">
              <Link href={"/politique-confidentialite"}>
                <a>{"Politique de confidentialité"}</a>
              </Link>
            </li>
            <li className="mb-2">
              <Link href={"/cgu"}>
                <a>{"Conditions générales d'utilisation"}</a>
              </Link>
            </li>
            <li className="mb-2">
              <Link href={"/faq"}>
                <a>FAQ</a>
              </Link>
            </li>
            <li className="mb-2">
              {/* <Link> */}
              <a href="mailto:contact.medle@fabrique.social.gouv.fr">Contactez&#8209;nous</a>
              {/* </Link> */}
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
      <nav aria-label="Navigation latérale" className="text-center list-group list-group-flush">
        {isAllowed(currentUser.role, ACT_MANAGEMENT) && currentUser.role !== SUPER_ADMIN && (
          <Link href="/acts/declaration">
            <a
              className={
                "list-group-item list-group-item-action " + (page === "declaration" ? "selected" : "unselected")
              }
            >
              <AddCircleOutlineIcon width={30} />
              <br />
              {"Ajout d'acte"}
            </a>
          </Link>
        )}
        {isAllowed(currentUser.role, ACT_CONSULTATION) && (
          <Link href="/acts">
            <a className={"list-group-item list-group-item-action " + (page === "acts" ? "selected" : "unselected")}>
              <FormatListBulletedIcon width={30} /> <br />
              {"Tous les actes"}
            </a>
          </Link>
        )}
        {isAllowed(currentUser.role, EMPLOYMENT_CONSULTATION) && (
          <Link href="/employments">
            <a
              className={
                "list-group-item list-group-item-action " + (page === "employments" ? "selected" : "unselected")
              }
            >
              <GroupIcon width={30} /> <br />
              {"Personnel"}
            </a>
          </Link>
        )}
        <Link href="/statistics">
          <a
            className={"list-group-item list-group-item-action " + (page === "statistics" ? "selected" : "unselected")}
          >
            <EqualizerIcon width={30} /> <br />
            {"Statistiques"}
          </a>
        </Link>
        {/* <Link href="/_error"> */}
        {isOpenFeature("directory") && (
          <a className="list-group-item list-group-item-action">
            <PhoneIcon width={30} /> <br />
            {"Annuaire"}
          </a>
        )}{" "}
        {/* </Link> */}
        {/* <Link href="/_error"> */}
        {isOpenFeature("resources") && (
          <a className="list-group-item list-group-item-action">
            <LocalLibraryIcon width={30} /> <br />
            {"Ressources"}
          </a>
        )}{" "}
        {/* </Link> */}
        {/* <Link href="/_error"> */}
        {isOpenFeature("administration") && isAllowed(currentUser.role, ADMIN) && (
          <Link href="/administration/users">
            <a className="list-group-item list-group-item-action">
              <SettingsIcon width={30} /> <br />
              {"Administration"}
            </a>
          </Link>
        )}{" "}
        {/* </Link> */}
      </nav>
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
  currentUser: PropTypes.object,
  page: PropTypes.string,
}

const SidebarAdmin = ({ page, currentUser }) => {
  if (!currentUser) return ""
  return (
    <>
      <nav aria-label="Navigation latérale d'administration" className="text-center list-group list-group-flush">
        {isAllowed(currentUser.role, ADMIN) && (
          <Link href="/administration/users">
            <a className={"list-group-item list-group-item-action " + (page === "users" ? "selected" : "unselected")}>
              <FaceIcon className="text-black-50" width={30} />

              <br />
              {"Utilisateurs"}
            </a>
          </Link>
        )}
        {currentUser.role === SUPER_ADMIN && (
          <Link href="/administration/hospitals">
            <a
              className={"list-group-item list-group-item-action " + (page === "hospitals" ? "selected" : "unselected")}
            >
              <ApartmentIcon width={30} /> <br />
              {"Établissements"}
            </a>
          </Link>
        )}
        {currentUser.role === SUPER_ADMIN && (
          <Link href="/administration/askers">
            <a className={"list-group-item list-group-item-action " + (page === "askers" ? "selected" : "unselected")}>
              <AccountBalanceIcon width={30} /> <br />
              {"Demandeurs"}
            </a>
          </Link>
        )}
        {currentUser.role === SUPER_ADMIN && (
          <Link href="/administration/attacks">
            <a className={"list-group-item list-group-item-action " + (page === "attacks" ? "selected" : "unselected")}>
              <WhatshotIcon width={30} /> <br />
              {"Attentats"}
            </a>
          </Link>
        )}
        {currentUser.role === SUPER_ADMIN && (
          <Link href="/administration/acts">
            <a className={"list-group-item list-group-item-action " + (page === "acts" ? "selected" : "unselected")}>
              <ReceiptIcon width={30} /> <br />
              {"Actes"}
            </a>
          </Link>
        )}
        {currentUser.role === SUPER_ADMIN && (
          <Link href="/administration/messages">
            <a
              className={"list-group-item list-group-item-action " + (page === "messages" ? "selected" : "unselected")}
            >
              <AnnouncementIcon width={30} /> <br />
              {"Messages"}
            </a>
          </Link>
        )}
        <Link href={startPageForRole(currentUser.role)}>
          <a className="list-group-item list-group-item-action">
            <ArrowBackIcon width={30} /> <br />
            {"Retour"}
          </a>
        </Link>
      </nav>
      <style jsx>{`
        a {
          font-variant: small-caps;
          font-size: 12px;
          font-family: "Source Sans Pro";
          color: #9b9b9b;
        }
        a.selected {
          border-left: 5px solid #9c27b0;
          background-color: #e7f1fe !important;
        }
        a.unselected {
          border-left: 5px solid #fff;
        }
      `}</style>
    </>
  )
}

SidebarAdmin.propTypes = {
  currentUser: PropTypes.object,
  page: PropTypes.string,
}

const Layout = ({ children, page, currentUser, admin = false }) => {
  return (
    <>
      <div className="d-flex flex-column justifiy-content-between min-vh-100">
        <Header currentUser={currentUser} />
        <div id="wrapper" className="d-flex">
          <div id="sidebar-wrapper" className="border-right">
            {!admin && <Sidebar page={page} currentUser={currentUser} />}
            {admin && <SidebarAdmin page={page} currentUser={currentUser} />}
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

Layout.propTypes = {
  admin: PropTypes.bool,
  children: PropTypes.node,
  currentUser: PropTypes.object,
  page: PropTypes.string,
}

export default Layout
