import React, { useState } from "react"
import Link from "next/link"
import Router from "next/router"
import PropTypes from "prop-types"
import { Alert, Col, Container, Form, FormGroup, Input, Spinner, Table } from "reactstrap"

import { SearchButton } from "../../components/form/SearchButton"
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
         <Title1 className="mt-5 mb-4">{"Tous les actes"}</Title1>
         <Container style={{ maxWidth: 980 }}>
            <Form onSubmit={onSubmit}>
               <FormGroup row inline className="mb-4 justify-content-center">
                  <Col className="flex-grow-1">
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
                           <th></th>
                        </tr>
                     </thead>
                     <tbody>
                        {paginatedData.elements.map(act => (
                           <Link key={act.id} href="/acts/[id]" as={`/acts/${act.id}`}>
                              <tr key={act.id}>
                                 <td>
                                    <b>{act.internalNumber}</b>
                                 </td>
                                 <td>{act.pvNumber}</td>
                                 <td>{act.examinationDate && isoToFr(act.examinationDate)}</td>
                                 <td>{act.profile}</td>
                                 <td>{act.examinationTypes && <VerticalList content={act.examinationTypes} />}</td>
                                 <td className="text-decoration">
                                    <Link href="/acts/[id]" as={`/acts/${act.id}`}>
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
