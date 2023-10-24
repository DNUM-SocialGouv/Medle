import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { PropTypes } from "prop-types"
import React, { useState } from "react"
import { Alert, Col, Container, Form, FormGroup, Spinner, Table } from "reactstrap"

import { searchHospitalsFuzzy } from "../../clients/hospitals"
import { SearchButton } from "../../components/form/SearchButton"
import Layout from "../../components/Layout"
import { InputDarker, Title1 } from "../../components/StyledComponents"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../utils/auth"
import { logError } from "../../utils/logger"
import { ACTIVITY_CONSULTATION, NO_PRIVILEGE_REQUIRED, REGIONAL_SUPERVISOR } from "../../utils/roles"

const HospitalPage = ({ hospitals: initialHospitals, currentUser }) => {
  const router = useRouter()
  const [hospitals, setHospitals] = useState(initialHospitals)
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    setSearch(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      setHospitals(await searchHospitalsFuzzy({ search }))
    } catch (error) {
      setError("Erreur serveur.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout page="hospitals" currentUser={currentUser} admin={false}>
      <Head>
        <title>Sythèse de l&apos;activité - Medlé</title>
      </Head>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1 className="">{"Choisir un établissement pour voir le synthèse de l'activité"}</Title1>
      </Container>

      <Container style={{ maxWidth: 980, minWidth: 740 }}>
        <Form onSubmit={onSubmit}>
          <FormGroup row inline className="mb-4 justify-content-center" role="group">
            <Col className="flex-grow-1">
              <InputDarker
                type="text"
                name="es"
                id="es"
                placeholder="Rechercher un établissement par son nom, etc."
                value={search}
                onChange={onChange}
                autoComplete="off"
                aria-label="Rechercher un établissement par son nom, etc."
                role="search"
              />
            </Col>
            <Col className="flex-grow-0">
              <SearchButton className="btn-primary" disabled={loading} onClick={onSubmit}>
                {loading ? <Spinner size="sm" color="light" data-testid="loading" /> : "Chercher"}
              </SearchButton>
            </Col>
          </FormGroup>
        </Form>
        {error && (
          <Alert color="danger" className="mb-4">
            {error}
          </Alert>
        )}
        {!error && !hospitals.length && <div className="text-center">{"Aucun établissement trouvé."}</div>}

        {!error && !!hospitals.length && (
          <>
            <Table responsive className="table-hover">
              <thead>
                <tr className="table-light">
                  <th scope="col">Nom</th>
                  <th scope="col" aria-label="Numéro Finess">
                    N° Finess
                  </th>
                  <th scope="col">Ville</th>
                  <th scope="col">Code postal</th>
                </tr>
              </thead>
              <tbody>
                {hospitals.map((hospital) => (
                  <tr
                    key={hospital.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push(`/synthese-activite/${hospital.id}`)}
                  >
                    <td>
                      <b>{`${hospital.name}`}</b>
                    </td>
                    <td>{hospital.finesseNumber}</td>
                    <td>{hospital.town}</td>
                    <td>{hospital.postalCode}</td>
                    <td>
                      <Link
                        href="/synthese-activite/[hid]"
                        as={`/synthese-activite/${hospital.id}`}
                        className="text-decoration-none"
                        aria-label={"Voir l'établissement " + hospital.name}
                      >
                        Synthèse de l&apos;activité
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
    </Layout>
  )
}

HospitalPage.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)

  try {
    const hospitals = await searchHospitalsFuzzy({ headers })
    return { hospitals }
  } catch (error) {
    logError("APP error", error)

    redirectIfUnauthorized(error, ctx)
  }
  return {}
}

HospitalPage.propTypes = {
  hospitals: PropTypes.array,
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(HospitalPage, ACTIVITY_CONSULTATION)
