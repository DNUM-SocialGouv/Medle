import AddIcon from "@material-ui/icons/Add"
import Link from "next/link"
import { PropTypes } from "prop-types"
import React, { useState } from "react"
import { Alert, Col, Container, Form, FormGroup, Input, Spinner, Table } from "reactstrap"

import { searchUsersFuzzy } from "../../../clients/users"
import { SearchButton } from "../../../components/form/SearchButton"
import Layout from "../../../components/Layout"
import Pagination from "../../../components/Pagination"
import { Title1 } from "../../../components/StyledComponents"
import { usePaginatedData } from "../../../hooks/usePaginatedData"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../utils/auth"
import { logError } from "../../../utils/logger"
import { ADMIN, ROLES_DESCRIPTION } from "../../../utils/roles"

const AdminUserPage = ({ paginatedData: initialPaginatedData, currentUser }) => {
  const [search, setSearch] = useState("")
  const [paginatedData, error, loading, fetchPage] = usePaginatedData(searchUsersFuzzy, initialPaginatedData)

  const onChange = (e) => {
    setSearch(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    fetchPage({ search })(0)
  }

  return (
    <Layout page="users" currentUser={currentUser} admin={true}>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1 className="">{"Administration des utilisateurs"}</Title1>
        <Link href="/administration/users/[id]" as={`/administration/users/new`}>
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
                placeholder="Rechercher un utilisateur par nom, prénom, email.."
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
        {!error && !paginatedData.elements.length && <div className="text-center">{"Aucun utilisateur trouvé."}</div>}

        {!error && !!paginatedData.elements.length && (
          <>
            <Pagination data={paginatedData} fn={fetchPage(search)} />
            <Table responsive className="table-hover">
              <thead>
                <tr className="table-light">
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Établissement</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {paginatedData.elements.map((user) => (
                  <Link key={user.id} href="/administration/users/[id]" as={`/administration/users/${user.id}`}>
                    <tr>
                      <td>
                        <b>{`${user.firstName} ${user.lastName}`}</b>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.role && ROLES_DESCRIPTION[user.role]}</td>
                      <td>{user.hospital && user.hospital.name}</td>
                      <td>
                        <Link href="/administration/users/[id]" as={`/administration/users/${user.id}`}>
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

AdminUserPage.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)

  try {
    const paginatedData = await searchUsersFuzzy({ headers })
    return { paginatedData }
  } catch (error) {
    logError("APP error", error)

    redirectIfUnauthorized(error, ctx)
  }
  return {}
}

AdminUserPage.propTypes = {
  paginatedData: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(AdminUserPage, ADMIN)
