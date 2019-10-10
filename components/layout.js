import React from "react"
import PropTypes from "prop-types"

const Header = () => <h1>Entête</h1>

const Footer = () => <h2>Bas de page</h2>

const Layout = ({ children }) => (
   <>
      <Header />
      {children}
      <Footer />
   </>
)

Layout.propTypes = { children: PropTypes.node.isRequired }

export default Layout
