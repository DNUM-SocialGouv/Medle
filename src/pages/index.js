import React, { useState } from "react"
import Head from "next/head"
import Login from "../components/Login"
import { ValidationError } from "../utils/errors"
import { registerAndRedirectUser } from "../utils/auth"
import PropTypes from "prop-types"
import { trackEvent, CATEGORY, ACTION } from "../utils/matomo"
import { logError } from "../utils/logger"
import { authenticate } from "../clients/authentication"

const LoginPage = ({ message }) => {
  const [error, setError] = useState(message || "")
  const checkUserData = ({ email, password }) => {
    if (!email || !password) throw new ValidationError("Les champs ne peuvent pas être vides")
  }
  let isMounted = false

  const authentication = (userData) => {
    isMounted = true
    return new Promise((resolve, reject) => {
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
          if ((error.status && error.status === 401) || error instanceof ValidationError) {
            setError("L'authentification est incorrecte")
          } else {
            setError("Problème serveur")
          }
          trackEvent(CATEGORY.auth, ACTION.auth.error, (userData && userData.email) || "no email")
          reject(error)
        }
      }, 1000)
    })
  }

  return (
    <>
      <Head>
        <title>Medlé : connexion</title>
      </Head>

      <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-center align-items-center min-vh-100">
        <Login authentication={authentication} error={error} />
      </div>
    </>
  )
}

LoginPage.propTypes = {
  message: PropTypes.string,
}

LoginPage.getInitialProps = async (ctx) => {
  const {
    query: { sessionTimeout },
  } = ctx

  if (sessionTimeout) {
    return { message: "Votre session s'est terminée." }
  }
  return { message: "" }
}

export default LoginPage
