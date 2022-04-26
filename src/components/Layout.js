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
import ImageIcon from "@material-ui/icons/Image"
import LinkRoundedIcon from "@material-ui/icons/LinkRounded"
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary"
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone"
import PhoneIcon from "@material-ui/icons/Phone"
import ReceiptIcon from "@material-ui/icons/Receipt"
import SettingsIcon from "@material-ui/icons/Settings"
import WhatshotIcon from "@material-ui/icons/Whatshot"
import getConfig from "next/config"
import Link from "next/link"
import { useRouter } from "next/router"
import PropTypes from "prop-types"
import React, { useState } from "react"
import {
  Collapse,
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
import { logout } from "../utils/auth"
import {
  footerDocumentAccessibilite,
  footerDocumentDonneesPersonnelles,
  footerDocumentFAQ,
  footerDocumentGestionCookies,
  footerDocumentMentionsLegales,
} from "../utils/documentsConstants"
import {
  ACT_CONSULTATION,
  ACT_MANAGEMENT,
  ADMIN,
  EMPLOYMENT_CONSULTATION,
  isAllowed,
  startPageForRole,
  SUPER_ADMIN,
} from "../utils/roles"
import FooterDocument from "./FooterDocument"
import Logo from "./Logo"

const { publicRuntimeConfig } = getConfig() || {}

export const Header = ({ currentUser }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <header className="border-bottom" role="banner">
      <Navbar expand="md" light>
        <Logo currentUser={currentUser} />
        {currentUser && !currentUser.resetPassword && (
          <NavbarBrand onClick={() => router.push("/statistics")} tabIndex="0">
            <img
              src={"/images/logo-medle.png"}
              alt="Retour à l'accueil de Medlé"
              width="160"
              style={{ cursor: "pointer", marginLeft: "10px" }}
            />
          </NavbarBrand>
        )}
        {!currentUser && (
          <NavbarBrand onClick={() => router.push("/")} tabIndex="0">
            <img
              src={"/images/logo-medle.png"}
              alt="Retour à l'accueil de Medlé"
              width="160"
              style={{ cursor: "pointer", marginLeft: "10px" }}
            />
          </NavbarBrand>
        )}
        <NavbarToggler onClick={toggle} aria-label="Afficher ou masquer le menu" />
        {currentUser && !currentUser.resetPassword && (
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

export const Footer = () => {
  return (
    <footer className="pt-4 pb-5" role="contentinfo">
      <Row>
        <Logo />
        <ul className="list-unstyled inline extern">
          <li>
            <a
              id="legifrance"
              aria-label="legifrance.gouv.fr (nouvelle fenêtre)"
              href="https://www.legifrance.gouv.fr"
              target="_blank"
              rel="noreferrer noopener"
            >
              legifrance.gouv.fr
            </a>
          </li>
          <li>
            <a
              id="gouvernement"
              aria-label="gouvernement.fr (nouvelle fenêtre)"
              href="https://www.gouvernement.fr"
              target="_blank"
              rel="noreferrer noopener"
            >
              gouvernement.fr
            </a>
          </li>
          <li>
            <a
              id="service-public"
              aria-label="service-public.fr (nouvelle fenêtre)"
              href="https://www.service-public.fr"
              target="_blank"
              rel="noreferrer noopener"
            >
              service-public.fr
            </a>
          </li>
          <li>
            <a
              id="data-gouv"
              aria-label="data.gouv.fr (nouvelle fenêtre)"
              href="https://www.data.gouv.fr"
              target="_blank"
              rel="noreferrer noopener"
            >
              data.gouv.fr
            </a>
          </li>
        </ul>
      </Row>
      <hr />
      <Row>
        <ul className="pl-0 list-unstyled inline intern">
          <li className="mb-2">
            <Link href={"/sitemap"}>
              <a>{"Plan du site"}</a>
            </Link>
          </li>
          <li className="mb-2">
            <FooterDocument type={footerDocumentAccessibilite} label={"Accessibilité : Partiellement conforme"} />
          </li>
          <li className="mb-2">
            <FooterDocument type={footerDocumentMentionsLegales} label={"Mentions légales"} />
          </li>
          <li className="mb-2">
            <FooterDocument type={footerDocumentDonneesPersonnelles} label={"Données personnelles"} />
          </li>
          <li className="mb-2">
            <FooterDocument type={footerDocumentGestionCookies} label={"Gestion des cookies"} />
          </li>
          <li className="mb-2">
            <FooterDocument type={footerDocumentFAQ} label={"Foire aux questions"} />
          </li>
          {publicRuntimeConfig && publicRuntimeConfig.MAIL_CONTACT && (
            <li className="mb-2">
              <a href={`mailto:${publicRuntimeConfig.MAIL_CONTACT}`}>Contactez&#8209;nous</a>
            </li>
          )}
        </ul>
      </Row>
      <Row>
        <span>
          Sauf mention contraire, tous les contenus de ce site sont sous{" "}
          <a
            aria-label="licence etalab-2.0 (nouvelle fenêtre)"
            href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
            target="_blank"
            rel="noreferrer noopener"
          >
            licence etalab-2.0
          </a>
        </span>
      </Row>
      <style jsx>{`
        footer {
          border-top: 1px solid light-grey;
          width: 95%;
          margin: auto;
        }
        .inline li {
          display: inline-block;
        }
        .extern {
          font-weight: bold;
          margin-left: auto;
          margin-top: 40px;
        }
        .intern {
          margin: 20px 0 30px 30px;
        }
        .extern a,
        .intern a {
          color: #181818;
          padding: 0px 15px;
        }
        .intern li:not(:last-child)::after {
          color: #181818;
          content: " | ";
        }
        hr {
          border-top: 1px solid light-grey;
        }
      `}</style>
    </footer>
  )
}

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
        {currentUser.role === SUPER_ADMIN && (
          <Link href="/administration/logos">
            <a
              className={"list-group-item list-group-item-action " + (page === "logos" ? "selected" : "unselected")}
              aria-current={page === "logos" ? "true" : "false"}
            >
              <ImageIcon width={30} /> <br />
              {"Logos"}
            </a>
          </Link>
        )}
        {currentUser.role === SUPER_ADMIN && (
          <Link href="/administration/footer-documents">
            <a
              className={
                "list-group-item list-group-item-action " + (page === "footer-documents" ? "selected" : "unselected")
              }
              aria-current={page === "footer-documents" ? "true" : "false"}
            >
              <LinkRoundedIcon width={30} /> <br />
              {"Documents du pied de page"}
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
