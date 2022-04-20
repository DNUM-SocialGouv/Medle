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
    <header className="border-bottom" role="banner">
      <Navbar expand="md" light>
        <NavbarBrand onClick={() => router.push("/statistics")} tabIndex="0">
          <img
            src={"/images/logo.png"}
            alt="Retour à l'accueil de Medlé"
            width="100"
            style={{ cursor: "pointer" }}
            id="header"
          />
        </NavbarBrand>
        <NavbarToggler onClick={toggle} aria-label="Afficher ou masquer le menu" />
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
                <DropdownToggle aria-label="Mon compte" nav>
                  <AccountCircleIcon width={30} style={{ color: "#555C64" }} />
                  <span className="d-sm-inline d-md-none text-black-50" aria-hidden="true">
                    &nbsp;Mon compte
                  </span>
                </DropdownToggle>

                <DropdownMenu right>
                  {currentUser && <DropdownItem>{currentUser.firstName + " " + currentUser.lastName} </DropdownItem>}
                  <DropdownItem divider />
                  <Link href="/profile">
                    <DropdownItem>Profil</DropdownItem>
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
  <footer className="pt-4 pb-5 m-0" role="contentinfo">
    <Container>
      <Row>
        <Col className="mr-5">
          <p className="service-title">Medle.fabrique.social.gouv.fr</p>
          Un service proposé par la{" "}
          <b>
            <a
              target="_blank"
              rel="noreferrer noopener"
              id="footer"
              href="https://solidarites-sante.gouv.fr/ministere/organisation/organisation-des-directions-et-services/article/organisation-de-la-direction-generale-de-l-offre-de-soins-dgos"
              aria-label="DGOS (nouvelle fenêtre)"
            >
              DGOS
            </a>
          </b>{" "}
          (ministère de la santé) et{" "}
          <b>
            <a
              target="_blank"
              href="https://www.fabrique.social.gouv.fr/"
              rel="noopener noreferrer"
              aria-label="Fabrique numérique des ministères sociaux (nouvelle fenêtre)"
            >
              {"la fabrique numérique des ministères sociaux"}
            </a>
          </b>{" "}
          (
          <b>
            <a
              target="_blank"
              href="https://beta.gouv.fr/"
              rel="noopener noreferrer"
              aria-label="beta.gouv.fr (nouvelle fenêtre)"
            >
              beta.gouv.fr
            </a>
          </b>
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
                <a>Foire aux questions</a>
              </Link>
            </li>
            <li className="mb-2">
              <Link href={"/sitemap"}>
                <a>Plan du site</a>
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
      footer a {
        color: ${colors.footer.color};
      }
      footer a:hover {
        color: ${colors.footerHover.color};
      }
      footer b {
        text-decoration: underline dotted;
      }
      .service-title {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
        font-family: Evolventa, "Trebuchet MS", sans-serif;
        font-weight: 700;
        line-height: 1.2;
      }
    `}</style>
  </footer>
)

const Sidebar = ({ page, currentUser }) => {
  if (!currentUser || currentUser.resetPassword) return ""
  return (
    <>
      <nav aria-label="Navigation latérale" className="text-center list-group list-group-flush" role="navigation">
        <ul>
          {isAllowed(currentUser.role, ACT_MANAGEMENT) && currentUser.role !== SUPER_ADMIN && (
            <li>
              <Link href="/acts/declaration">
                <a
                  className={
                    "list-group-item list-group-item-action " + (page === "declaration" ? "selected" : "unselected")
                  }
                  aria-current={page === "declaration" ? "true" : "false"}
                >
                  <AddCircleOutlineIcon width={30} />
                  <br />
                  {"Ajout d'acte"}
                </a>
              </Link>
            </li>
          )}
          {isAllowed(currentUser.role, ACT_CONSULTATION) && (
            <li>
              <Link href="/acts">
                <a
                  className={"list-group-item list-group-item-action " + (page === "acts" ? "selected" : "unselected")}
                  id="navigation"
                  aria-current={page === "acts" ? "true" : "false"}
                >
                  <FormatListBulletedIcon width={30} /> <br />
                  {"Tous les actes"}
                </a>
              </Link>
            </li>
          )}
          {isAllowed(currentUser.role, EMPLOYMENT_CONSULTATION) && (
            <li>
              <Link href="/employments">
                <a
                  className={
                    "list-group-item list-group-item-action " + (page === "employments" ? "selected" : "unselected")
                  }
                  aria-current={page === "employments" ? "true" : "false"}
                >
                  <GroupIcon width={30} /> <br />
                  {"Personnel"}
                </a>
              </Link>
            </li>
          )}
          <li>
            <Link href="/statistics">
              <a
                className={
                  "list-group-item list-group-item-action " + (page === "statistics" ? "selected" : "unselected")
                }
                aria-current={page === "statistics" ? "true" : "false"}
              >
                <EqualizerIcon width={30} /> <br />
                {"Statistiques"}
              </a>
            </Link>
          </li>
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
            <li>
              <Link href="/administration/users">
                <a className="list-group-item list-group-item-action">
                  <SettingsIcon width={30} /> <br />
                  {"Administration"}
                </a>
              </Link>
            </li>
          )}{" "}
          {/* </Link> */}
        </ul>
      </nav>
      <style jsx>{`
        ul {
          padding-left: 0;
        }
        li {
          list-style: none;
        }
        a {
          font-variant: small-caps;
          font-size: 12px;
          font-family: "Source Sans Pro";
          color: #555c64;
        }
        a:hover {
          color: black;
        }
        a.selected {
          border-left: 5px solid #2e73e2;
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
      <nav
        role="navigation"
        aria-label="Navigation latérale d'administration"
        className="text-center list-group list-group-flush"
      >
        {isAllowed(currentUser.role, ADMIN) && (
          <Link href="/administration/users">
            <a
              className={"list-group-item list-group-item-action " + (page === "users" ? "selected" : "unselected")}
              id="adminNavigation"
              aria-current={page === "users" ? "true" : "false"}
            >
              <FaceIcon width={30} />

              <br />
              {"Utilisateurs"}
            </a>
          </Link>
        )}
        {currentUser.role === SUPER_ADMIN && (
          <Link href="/administration/hospitals">
            <a
              className={"list-group-item list-group-item-action " + (page === "hospitals" ? "selected" : "unselected")}
              aria-current={page === "hospitals" ? "true" : "false"}
            >
              <ApartmentIcon width={30} /> <br />
              {"Établissements"}
            </a>
          </Link>
        )}
        {currentUser.role === SUPER_ADMIN && (
          <Link href="/administration/askers">
            <a
              className={"list-group-item list-group-item-action " + (page === "askers" ? "selected" : "unselected")}
              aria-current={page === "askers" ? "true" : "false"}
            >
              <AccountBalanceIcon width={30} /> <br />
              {"Demandeurs"}
            </a>
          </Link>
        )}
        {currentUser.role === SUPER_ADMIN && (
          <Link href="/administration/attacks">
            <a
              className={"list-group-item list-group-item-action " + (page === "attacks" ? "selected" : "unselected")}
              aria-current={page === "attacks" ? "true" : "false"}
            >
              <WhatshotIcon width={30} /> <br />
              {"Attentats"}
            </a>
          </Link>
        )}
        {currentUser.role === SUPER_ADMIN && (
          <Link href="/administration/acts">
            <a
              className={"list-group-item list-group-item-action " + (page === "acts" ? "selected" : "unselected")}
              aria-current={page === "acts" ? "true" : "false"}
            >
              <ReceiptIcon width={30} /> <br />
              {"Actes"}
            </a>
          </Link>
        )}
        {currentUser.role === SUPER_ADMIN && (
          <Link href="/administration/messages">
            <a
              className={"list-group-item list-group-item-action " + (page === "messages" ? "selected" : "unselected")}
              aria-current={page === "messages" ? "true" : "false"}
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
          color: #555c64;
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

function giveFooterFocus() {
  document.getElementById("footer").focus()
}
function giveNavFocus() {
  const sidebar = document.getElementById("navigation")

  if (sidebar) {
    document.getElementById("navigation").focus()
  } else {
    document.getElementById("adminNavigation").focus()
  }
}
function giveMainFocus() {
  document.getElementById("page-content-wrapper").focus()
}

const SkipLinks = () => {
  return (
    <>
      <nav>
        <ul className="skipLinks">
          <li>
            <a className="link-skip-to-content" onClick={giveNavFocus} href="#navigation">
              Aller au menu
            </a>
          </li>
          <li>
            <a className="link-skip-to-content" onClick={giveMainFocus} href="#main">
              Aller au contenu
            </a>
          </li>
          <li>
            <a className="link-skip-to-content" onClick={giveFooterFocus} href="#footer">
              Aller au pied de page
            </a>
          </li>
        </ul>
      </nav>
      <style jsx>{`
        .skipLinks {
          position: absolute;
          z-index: 999;
          left: 50%;
          text-align: center;
          margin-top: 0;
          margin-bottom: 1rem;
          list-style: none;
        }
        .link-skip-to-content {
          position: absolute;
          height: 1px;
          width: 1px;
          font-weight: 700;
          overflow: hidden;
          white-space: nowrap;
        }
        .link-skip-to-content:focus {
          overflow: visible;
        }
      `}</style>
    </>
  )
}

const Layout = ({ children, page, currentUser, admin = false }) => {
  return (
    <>
      <div className="d-flex flex-column justifiy-content-between min-vh-100">
        <Header currentUser={currentUser} />
        <div id="wrapper" className="d-flex">
          <div id="sidebar-wrapper" className="border-right">
            <SkipLinks />
            {!admin && <Sidebar page={page} currentUser={currentUser} />}
            {admin && <SidebarAdmin page={page} currentUser={currentUser} />}
          </div>
          <div id="page-content-wrapper">
            <main role="main" className="pb-5" id="main">
              {children}
            </main>
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
