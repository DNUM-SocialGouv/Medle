import Head from "next/head"
import { PropTypes } from "prop-types"
import React, { useState } from "react"
import { Alert, Button, Container, Form, FormGroup, Label, Spinner } from "reactstrap"

import { findAppSettings, updateAppSettings } from "../../clients/app-settings"
import Layout from "../../components/Layout"
import { InputDarker, Title1 } from "../../components/StyledComponents"
import { buildAuthHeaders, getCurrentUser, isomorphicRedirect, redirectIfUnauthorized, withAuthentication } from "../../utils/auth"
import { preventDefault } from "../../utils/form"
import { logError } from "../../utils/logger"
import { ADMIN, SUPER_ADMIN } from "../../utils/roles"

const SettingsPage = ({ appSettings = {}, currentUser }) => {
  const [usersPurgeInactivityDays, setUsersPurgeInactivityDays] = useState(appSettings.usersPurgeInactivityDays)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = preventDefault(async () => {
    setError("")
    setSuccess("")

    const parsedUsersPurgeInactivityDays = Number.parseInt(usersPurgeInactivityDays, 10)

    if (!Number.isInteger(parsedUsersPurgeInactivityDays) || parsedUsersPurgeInactivityDays <= 0) {
      setError("La durée de non connexion doit être un nombre de jours strictement positif.")
      return
    }

    setLoading(true)
    try {
      const updatedSettings = await updateAppSettings({ usersPurgeInactivityDays: parsedUsersPurgeInactivityDays })
      setUsersPurgeInactivityDays(updatedSettings.usersPurgeInactivityDays)
      setSuccess("Paramètres enregistrés.")
    } catch (err) {
      logError(err)
      setError("Les paramètres n'ont pas pu être enregistrés.")
    } finally {
      setLoading(false)
    }
  })

  return (
    <Layout page="settings" currentUser={currentUser} admin={true}>
      <Head>
        <title>Administration des paramètres - Medlé</title>
      </Head>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1 className="">{"Administration des paramètres"}</Title1>
      </Container>
      <Container style={{ maxWidth: 980, minWidth: 740 }}>
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <Label for="usersPurgeInactivityDays">Durée de non connexion avant purge des utilisateurs</Label>
            <InputDarker
              id="usersPurgeInactivityDays"
              name="usersPurgeInactivityDays"
              type="number"
              min="1"
              step="1"
              value={usersPurgeInactivityDays}
              onChange={(event) => setUsersPurgeInactivityDays(event.target.value)}
            />
          </FormGroup>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" color="light" data-testid="loading" /> : "Enregistrer"}
          </Button>
        </Form>
      </Container>
    </Layout>
  )
}

SettingsPage.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)
  const currentUser = getCurrentUser(ctx)

  if (currentUser?.role !== SUPER_ADMIN) {
    isomorphicRedirect(ctx, "/permissionError")
    return {}
  }

  try {
    const appSettings = await findAppSettings(headers)
    return { appSettings }
  } catch (error) {
    logError("APP error", error)
    redirectIfUnauthorized(error, ctx)
  }

  return {}
}

SettingsPage.propTypes = {
  appSettings: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(SettingsPage, ADMIN)