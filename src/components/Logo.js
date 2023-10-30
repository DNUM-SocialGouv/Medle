import { useRouter } from "next/router"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { NavbarBrand } from "reactstrap"

import { findLogo } from "../clients/logos"
import { SUPER_ADMIN } from "../utils/roles"
import Image from "next/image"

const Logo = ({ currentUser }) => {
  const router = useRouter()
  const [logo, setLogo] = useState()

  const fetchLogo = async () => {
    try {
      const logoData = await findLogo()
      const url = URL.createObjectURL(new Blob([logoData]))
      setLogo(url)
    } catch (error) {
      console.warn("Pas de logo ministère trouvé.")
    }
  }

  useEffect(() => {
    fetchLogo()
  }, [])

  return (
    <>
      {currentUser && !currentUser.resetPassword && currentUser.role === SUPER_ADMIN && (
        <NavbarBrand
          onClick={() => router.push("/administration/logos")}
          aria-label="Changer le logo du ministère"
          tabIndex="0"
        >
          <Image src={logo} alt="Logo ministère" width={211} height="120" style={{ cursor: "pointer" }} id="header" />
        </NavbarBrand>
      )}
      {currentUser && !currentUser.resetPassword && currentUser.role !== SUPER_ADMIN && (
        <NavbarBrand onClick={() => router.push("/statistics")} tabIndex="0">
          <Image src={logo} alt="Logo ministère" width={211} height="120" style={{ cursor: "pointer" }} id="header" />
        </NavbarBrand>
      )}
      {!currentUser && (
        <NavbarBrand onClick={() => router.push("/")} tabIndex="0">
          <Image src={logo} width={211} alt="Logo ministère" height="120" style={{ cursor: "pointer" }} id="header" />
        </NavbarBrand>
      )}
    </>
  )
}

Logo.propTypes = {
  currentUser: PropTypes.object,
}

export default Logo
