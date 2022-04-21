import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import {
    NavbarBrand
} from "reactstrap"
import { useRouter } from "next/router"

import { findLogo } from "../clients/logo"
import { SUPER_ADMIN } from "../utils/roles"


const Logo = ({ currentUser }) => {
    const router = useRouter()
    const [logo, setLogo] = useState("/images/Republique_Francaise_RVB.svg");
        
    const fetchLogo = async () => {
        try {
            const logoData = await findLogo()
            const url = URL.createObjectURL(new Blob([logoData]))
            setLogo(url)
        } catch (error) {
            console.log("Pas de logo trouvé.")
        }
    }

    useEffect(() => {
        fetchLogo()
    }, [])
    
    return (
        <>
            { currentUser && 
                <>
                    <NavbarBrand onClick={() => router.push("/administration/logo")} tabIndex="0" aria-label="Changer le logo du ministère">
                        {currentUser.role === SUPER_ADMIN &&
                            <img
                                src={logo}
                                alt="Logo de la République Française"
                                height="120"
                                width="180"
                                style={{ cursor: "pointer"}}
                            />
                        }
                    </NavbarBrand>
                    <NavbarBrand onClick={() => router.push("/statistics")} tabIndex="0">
                        {currentUser.role !== SUPER_ADMIN &&
                            <img
                                src={logo}
                                alt="Logo de la République Française"
                                height="120"
                                width="180"
                                style={{ cursor: "pointer"}}
                            />
                        }
                    </NavbarBrand>
                </>
            }
            { !currentUser && 
                <NavbarBrand onClick={() => router.push("/")} tabIndex="0">
                    <img
                        src={logo}
                        alt="Logo de la République Française"
                        height="120"
                        width="180"
                        style={{ cursor: "pointer"}}
                    />
                </NavbarBrand>
            }
        </>
    )
}

Logo.propTypes = {
    currentUser: PropTypes.object,
}

export default Logo