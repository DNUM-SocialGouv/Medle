import React, { useState } from "react"
import Head from "next/head"
import Login from "../components/Login"
import { ValidationError } from "../utils/errors"
import { registerAndRedirectUser } from "../utils/auth"
import PropTypes from "prop-types"
import { trackEvent, CATEGORY, ACTION } from "../utils/matomo"
import { logError } from "../utils/logger"
import { authenticate } from "../clients/authentication"
import { findAllMessages } from "../clients/messages"

const LoginPage = ({ message, welcomeMessage }) => {
  const [error, setError] = useState(message || "")
  const [dismiss, setDismiss] = useState(false)

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

      <div
        className="d-flex flex-column justify-content-center align-items-center min-vh-100 container"
        style={{ maxWidth: 800 }}
      >
        {welcomeMessage && (
          <div
            className={`alert alert-warning alert-dismissible w-100 mx-5 mt-3 mb-0 mb-md-5 py-3 overflow-auto ${
              dismiss && "d-none"
            }`}
            style={{ maxHeight: 200 }}
            role="alert"
          >
            <div className="mb-2">{/* <em>01/06/2020</em> */}</div>
            <div className="text-justify">
              {welcomeMessage}
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
                onClick={() => setDismiss(true)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
        )}
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
          <Login authentication={authentication} error={error} />
        </div>
      </div>
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
    const messages = await findAllMessages()
    if (messages?.length) welcomeMessage = messages?.[0]?.content
  } catch (error) {
    logError(error)
  }

  return { message: sessionTimeout ? "Votre session s'est terminée." : "", welcomeMessage }
}

export default LoginPage
