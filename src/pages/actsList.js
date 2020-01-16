import React, { useState } from "react"
import Link from "next/link"
import PropTypes from "prop-types"
import fetch from "isomorphic-unfetch"
import moment from "moment"
import { Alert, Button, Col, Container, Form, FormGroup, Input, Spinner, Table } from "reactstrap"

import { buildOptionsFetch, withAuthentication } from "../utils/auth"
import { API_URL, ACT_SEARCH_ENDPOINT } from "../config"
import { Title1 } from "../components/StyledComponents"
import Layout from "../components/Layout"
import { VerticalList } from "../components/VerticalList"
import { FORMAT_DATE } from "../utils/date"
import { ACT_CONSULTATION } from "../utils/roles"
import { handleAPIResponse } from "../utils/errors"

const fetchData = async ({ search, optionsFetch }) => {
   const bonus = search ? `?fuzzy=${search}` : ""
   const response = await fetch(`${API_URL}${ACT_SEARCH_ENDPOINT}${bonus}`, optionsFetch)

   return handleAPIResponse(response)
}

const ActsListPage = ({ initialActs, currentUser }) => {
   const [search, setSearch] = useState("")
   const [acts, setActs] = useState(initialActs || [])
   const [isError, setIsError] = useState()
   const [isLoading, setIsLoading] = useState(false)

   const onChange = e => {
      setSearch(e.target.value)
   }

   const onSubmit = e => {
      e.preventDefault()
      handleSearch()
   }

   const handleSearch = async () => {
      setIsLoading(true)
      setIsError(false)

      let acts

      try {
         acts = await fetchData({ search })
      } catch (error) {
         console.error("APP error", error)
         setIsError("Erreur en base de données")
      } finally {
         setIsLoading(false)
         setActs(acts || [])
      }
   }

   return (
      <Layout page="actsList" currentUser={currentUser}>
         <Title1 className="mt-5 mb-4">{"L'activité de votre UMJ/IML"}</Title1>
         <Container style={{ maxWidth: 980 }}>
            <Form onSubmit={onSubmit}>
               <FormGroup row inline>
                  <Col md={{ size: 6, offset: 3 }}>
                     <Input
                        type="text"
                        name="es"
                        id="es"
                        placeholder="Rechercher un dossier par numéro, type de profil examiné, ..."
                        value={search}
                        onChange={onChange}
                     />
                  </Col>
                  <Col className="text-align-right" md={{ size: 3 }}>
                     <Button>Chercher</Button>
                  </Col>
               </FormGroup>
            </Form>

            {isLoading && (
               <div style={{ width: 100 }} className="mx-auto mt-5 mb-3">
                  <Spinner color="primary">Loading...</Spinner>
               </div>
            )}

            {isError && (
               <Alert color="danger" className="mt-5 mb-5">
                  {isError}
               </Alert>
            )}

            {!isError && !isLoading && (
               <Table responsive className="mt-5 table-hover">
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
                     {acts.map(act => (
                        <tr key={act.id}>
                           <td>
                              <b>{act.internal_number}</b>
                           </td>
                           <td>{act.pv_number}</td>
                           <td>{act.examination_date && moment(act.examination_date).format(FORMAT_DATE)}</td>
                           <td>{act.profile}</td>
                           <td>{act.extra_data && <VerticalList content={act.extra_data.examinationTypes} />}</td>
                           <td>
                              <Link href="/actDetail/[id]" as={`/actDetail/${act.id}`}>
                                 <a>{"Voir >"}</a>
                              </Link>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </Table>
            )}
         </Container>
      </Layout>
   )
}

ActsListPage.getInitialProps = async ctx => {
   const optionsFetch = buildOptionsFetch(ctx)

   try {
      const acts = await fetchData({ optionsFetch })
      return { initialActs: acts }
   } catch (error) {
      console.error("APP error", error)
   }
   return {}
}

ActsListPage.propTypes = {
   initialActs: PropTypes.array,
   currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(ActsListPage, ACT_CONSULTATION)
