import React, { useState } from "react"
import Link from "next/link"
import { PropTypes } from "prop-types"
import { Alert, Col, Form, FormGroup, Input, Spinner, Table, Container } from "reactstrap"
import AddIcon from "@material-ui/icons/Add"

import Layout from "../../../components/Layout"
import { Title1 } from "../../../components/StyledComponents"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../utils/auth"
import { logError } from "../../../utils/logger"
import { ADMIN } from "../../../utils/roles"
import { SearchButton } from "../../../components/form/SearchButton"
import { searchHospitalsFuzzy } from "../../../clients/hospitals"

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
          <FormGroup row inline className="mb-4 justify-content-center">
            <Col className="flex-grow-1">
              <Input
                type="text"
                name="es"
                id="es"
                placeholder="Rechercher un établissement par son nom, etc."
                value={search}
                onChange={onChange}
                autoComplete="off"
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
                  <th>Nom</th>
                  <th>N° Finess</th>
                  <th>Ville</th>
                  <th>Code postal</th>
                </tr>
              </thead>
              <tbody>
                {hospitals.map((hospital) => (
                  <Link
                    key={hospital.id}
                    href="/administration/hospitals/[id]"
                    as={`/administration/hospitals/${hospital.id}`}
                  >
                    <tr>
                      <td>
                        <b>{`${hospital.name}`}</b>
                      </td>
                      <td>{hospital.finesseNumber}</td>
                      <td>{hospital.town}</td>
                      <td>{hospital.postalCode}</td>
                      <td>
                        <Link href="/administration/hospitals/[id]" as={`/administration/hospitals/${hospital.id}`}>
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
