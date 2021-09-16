import AddIcon from "@material-ui/icons/Add"
import Head from "next/head"
import Link from "next/link"
import { PropTypes } from "prop-types"
import React, { useState } from "react"
import { Alert, Col, Container, Form, FormGroup, Spinner, Table } from "reactstrap"

import { searchAskersFuzzy } from "../../../clients/askers"
import { SearchButton } from "../../../components/form/SearchButton"
import Layout from "../../../components/Layout"
import Pagination from "../../../components/Pagination"
import { InputDarker, Title1 } from "../../../components/StyledComponents"
import { usePaginatedData } from "../../../hooks/usePaginatedData"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../utils/auth"
import { logError } from "../../../utils/logger"
import { ADMIN } from "../../../utils/roles"

const AdminAskerPage = ({ paginatedData: initialPaginatedData, currentUser }) => {
  const [search, setSearch] = useState("")
  const [paginatedData, error, loading, fetchPage] = usePaginatedData(searchAskersFuzzy, initialPaginatedData)

  const onChange = (e) => {
    setSearch(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    fetchPage({ search })(0)
  }

  return (
    <Layout page="askers" currentUser={currentUser} admin={true}>
      <Head>
        <title>Administration des demandeurs - Medlé</title>
      </Head>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1 className="">{"Administration des demandeurs"}</Title1>
        <Link href="/administration/askers/[id]" as={`/administration/askers/new`}>
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
                placeholder="Rechercher un demandeur par son nom, etc."
                value={search}
                onChange={onChange}
                autoComplete="off"
                aria-label="Rechercher un demandeur par son nom, etc."
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

        {!error && !paginatedData.elements.length && <div className="text-center">{"Aucun demandeur trouvé."}</div>}

        {!error && !!paginatedData.elements.length && (
          <>
            <Pagination data={paginatedData} fn={fetchPage(search)} />

            <Table responsive className="table-hover">
              <thead>
                <tr className="table-light">
                  <th scope="col">Nom</th>
                  <th scope="col">Département</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.elements.map((asker) => (
                  <Link key={asker.id} href="/administration/askers/[id]" as={`/administration/askers/${asker.id}`}>
                    <tr style={{ cursor: "pointer" }}>
                      <td>
                        <b>{`${asker.name}`}</b>
                      </td>
                      <td>{asker.depCode}</td>
                      <td>
                        <Link href="/administration/askers/[id]" as={`/administration/askers/${asker.id}`}>
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

AdminAskerPage.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)

  try {
    const paginatedData = await searchAskersFuzzy({ headers })
    return { paginatedData }
  } catch (error) {
    logError("APP error", error)

    redirectIfUnauthorized(error, ctx)
  }
  return {}
}

AdminAskerPage.propTypes = {
  paginatedData: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(AdminAskerPage, ADMIN)
