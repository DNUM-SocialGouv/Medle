import React, { useState } from "react"
import Link from "next/link"
import nextCookie from "next-cookies"
import PropTypes from "prop-types"
import { withAuthSync } from "../utils/auth"
import { API_URL, ACT_SEARCH_ENDPOINT } from "../config"
import fetch from "isomorphic-unfetch"
import Layout from "../components/Layout"
import { Title1 } from "../components/StyledComponents"
import moment from "moment"
import { FORMAT_DATE } from "../utils/constants"
import { Alert, Button, Col, Container, Form, FormGroup, Input, Label, Spinner, Table } from "reactstrap"
import { ACT_CONSULTATION, isAllowed } from "../utils/roles"

import { handleAPIResponse } from "../utils/errors"

const fetchData = async search => {
   const bonus = search ? `?fuzzy=${search}` : ""
   const response = await fetch(`${API_URL}${ACT_SEARCH_ENDPOINT}${bonus}`)

   return handleAPIResponse(response)
}

const ActsListPage = ({ initialActs, error }) => {
   const [search, setSearch] = useState("")
   const [acts, setActs] = useState(initialActs || [])
   const [isError, setIsError] = useState(error)
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
         acts = await fetchData(search)
      } catch (error) {
         console.error(error)
         setIsError("Erreur en base de données")
      } finally {
         setIsLoading(false)
         setActs(acts || [])
      }
   }

   return (
      <Layout page="actsList">
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
                           <td>
                              <Link href={`/actDetail/${act.id}`}>
                                 <a>{"Modifier / voir >"}</a>
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
   const { role } = nextCookie(ctx)

   if (!isAllowed(role, ACT_CONSULTATION)) {
      return { error: "Vous n'êtes pas autorisé à consulter les actes." }
   }
   return { initialActs: await fetchData() }
}

ActsListPage.propTypes = {
   initialActs: PropTypes.array,
   error: PropTypes.string,
}

export default withAuthSync(ActsListPage)
