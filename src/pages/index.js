import Head from "next/head"
import PropTypes from "prop-types"
import React, { useState } from "react"

import { authenticate } from "../clients/authentication"
import { findAllActiveMessages } from "../clients/messages"
import { Footer } from "../components/Layout"
import Login from "../components/Login"
import WelcomeMessage from "../components/WelcomeMessage"
import { registerAndRedirectUser } from "../utils/auth"
import { ValidationError } from "../utils/errors"
import { logError } from "../utils/logger"
import { ACTION, CATEGORY, trackEvent } from "../utils/matomo"

const LoginPage = ({ message, welcomeMessage }) => {
  const [error, setError] = useState(message || "")

  const checkUserData = ({ email, password }) => {
    if (!email || !password) throw new ValidationError("Les champs ne peuvent pas être vides")
  }
  let isMounted = false

  const authentication = (userData) => {
    isMounted = true
    return new Promise((resolve) => {
      if (isMounted) setError("")

      setTimeout(async () => {
        const { email, password } = userData

        try {
          checkUserData(userData)

          const { user } = await authenticate(email, password)

          registerAndRedirectUser(user)
          trackEvent(CATEGORY.auth, ACTION.auth.connection)
          resolve("OK")
        } catch (error) {
          logError(error)
          setError("L'authentification est incorrecte")
          trackEvent(CATEGORY.auth, ACTION.auth.error, (userData && userData.email) || "no email")
          resolve("KO")
        }
      }, 1000)
    })
  }

  return (
    <>
      <Head>
        <title>Connexion - Medlé</title>
      </Head>

      <div
        className="d-flex flex-column justify-content-center align-items-center min-vh-100 container"
        style={{ maxWidth: 800 }}
      >
        {welcomeMessage && <WelcomeMessage message={welcomeMessage} />}
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
          <Login authentication={authentication} error={error} />
        </div>
      </div>
      <Footer />
    </>
  )
}

LoginPage.propTypes = {
  message: PropTypes.string,
  welcomeMessage: PropTypes.string,
}

LoginPage.getInitialProps = async (ctx) => {
  const {
    query: { sessionTimeout },
  } = ctx

  let welcomeMessage

  try {
    ;[welcomeMessage] = (await findAllActiveMessages()).map(({ content }) => content)
  } catch (error) {
    logError(error)
  }

  return { message: sessionTimeout ? "Votre session s'est terminée." : "", welcomeMessage }
}

export default LoginPage
