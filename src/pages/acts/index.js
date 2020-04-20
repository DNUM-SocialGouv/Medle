import React, { useState } from "react"
import Link from "next/link"
import PropTypes from "prop-types"
import { Alert, Button, Col, Container, Form, FormGroup, Input, Spinner, Table } from "reactstrap"

import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../utils/auth"
import { Title1 } from "../../components/StyledComponents"
import Pagination from "../../components/Pagination"
import Layout from "../../components/Layout"
import { VerticalList } from "../../components/VerticalList"
import { isoToFr } from "../../utils/date"
import { ACT_CONSULTATION } from "../../utils/roles"
import { logError } from "../../utils/logger"
import { usePaginatedData } from "../../utils/hooks"
import { searchActsFuzzy } from "../../clients/acts"

const ActsListPage = ({ paginatedData: initialPaginatedData, currentUser }) => {
   const [search, setSearch] = useState("")
   const [paginatedData, error, loading, fetchPage] = usePaginatedData(searchActsFuzzy, initialPaginatedData)

   const onChange = e => {
      setSearch(e.target.value)
   }

   const onSubmit = e => {
      e.preventDefault()
      fetchPage(search)(0)
   }

   return (
      <Layout page="acts" currentUser={currentUser}>
         <Title1 className="mt-5 mb-4">{"L'activité de votre UMJ/IML"}</Title1>
         <Container style={{ maxWidth: 980 }}>
            <Form onSubmit={onSubmit}>
               <FormGroup row inline className="mb-4 justify-content-center">
                  <Col className="ml-auto" sm="9">
                     <Input
                        type="text"
                        name="es"
                        id="es"
                        placeholder="Rechercher un dossier par numéro, type de profil examiné, ..."
                        value={search}
                        onChange={onChange}
                        autoComplete="off"
                     />
                  </Col>
                  <Col sm="3" className="mt-4 text-center mt-sm-0">
                     <Button className="w-lg-75" disabled={loading}>
                        {loading ? <Spinner size="sm" color="light" data-testid="loading" /> : "Chercher"}
                     </Button>
                  </Col>
               </FormGroup>
            </Form>
            {error && (
               <Alert color="danger" className="mb-4">
                  {error}
               </Alert>
            )}
            {!error && !paginatedData.elements.length && <div className="text-center">{"Aucun acte trouvé."}</div>}

            {!error && !!paginatedData.elements.length && (
               <>
                  <Pagination data={paginatedData} fn={fetchPage(search)} />
                  <Table responsive className="table-hover">
                     <thead>
                        <tr className="table-light">
                           <th>N° dossier interne</th>
                           <th>N° PV</th>
                           <th>Date</th>
                           <th>Type de profil</th>
                           <th>{"Type d'acte"}</th>
                        </tr>
                     </thead>
                     <tbody>
                        {paginatedData.elements.map(act => (
                           <tr key={act.id} className="position-relative">
                              <td>
                                 <Link href="/acts/[id]" as={`/acts/${act.id}`}>
                                    <a className="stretched-link text-decoration-none text-body">
                                       <b>{act.internalNumber}</b>
                                    </a>
                                 </Link>
                              </td>
                              <td>{act.pvNumber}</td>
                              <td>{act.examinationDate && isoToFr(act.examinationDate)}</td>
                              <td>{act.profile}</td>
                              <td>{act.examinationTypes && <VerticalList content={act.examinationTypes} />}</td>
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

ActsListPage.getInitialProps = async ctx => {
   const headers = buildAuthHeaders(ctx)
   try {
      const paginatedData = await searchActsFuzzy({ headers })
      return { paginatedData }
   } catch (error) {
      logError("APP error", error)

      redirectIfUnauthorized(error, ctx)
   }
   return {}
}

ActsListPage.propTypes = {
   paginatedData: PropTypes.object.isRequired,
   currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(ActsListPage, ACT_CONSULTATION)
