import AddIcon from "@material-ui/icons/Add"
import Head from "next/head"
import Link from "next/link"
import { PropTypes } from "prop-types"
import React, { useState } from "react"
import { Alert, Col, Container, Form, FormGroup, Spinner, Table } from "reactstrap"

import { searchHospitalsFuzzy } from "../../../clients/hospitals"
import { SearchButton } from "../../../components/form/SearchButton"
import Layout from "../../../components/Layout"
import { InputDarker, Title1 } from "../../../components/StyledComponents"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../utils/auth"
import { logError } from "../../../utils/logger"
import { ADMIN } from "../../../utils/roles"

const AdminHospitalPage = ({ hospitals: initialHospitals, currentUser }) => {
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
    <Layout page="hospitals" currentUser={currentUser} admin={true}>
      <Head>
        <title>Administration des établissements - Medlé</title>
      </Head>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1 className="">{"Administration des établissements"}</Title1>
        <Link href="/administration/hospitals/[id]" as={`/administration/hospitals/new`}>
          <a>
            <SearchButton className="btn-outline-primary">
              <AddIcon />
              &nbsp; Ajouter
            </SearchButton>
          </a>
        </Link>
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
                  <th scope="col" aria-label="Numéro Finess">N° Finess</th>
                  <th scope="col">Ville</th>
                  <th scope="col">Code postal</th>
                </tr>
              </thead>
              <tbody>
                {hospitals.map((hospital) => (
                  <Link
                    key={hospital.id}
                    href="/administration/hospitals/[hid]"
                    as={`/administration/hospitals/${hospital.id}`}
                  >
                    <tr style={{ cursor: 'pointer'}}>
                      <td>
                        <b>{`${hospital.name}`}</b>
                      </td>
                      <td>{hospital.finesseNumber}</td>
                      <td>{hospital.town}</td>
                      <td>{hospital.postalCode}</td>
                      <td>
                        <Link href="/administration/hospitals/[hid]" as={`/administration/hospitals/${hospital.id}`}>
                          <a className="text-decoration-none">Voir</a>
                        </Link>
                      </td>
                    </tr>
                  </Link>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
    </Layout>
  )
}

AdminHospitalPage.getInitialProps = async (ctx) => {
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

AdminHospitalPage.propTypes = {
  hospitals: PropTypes.array,
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(AdminHospitalPage, ADMIN)
