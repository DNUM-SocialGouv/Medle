import React, { useState } from "react"
import Link from "next/link"
import PropTypes from "prop-types"
import { withAuthSync } from "../utils/auth"
import { APP_URL, ACT_LIST_ENDPOINT } from "../config"
import fetch from "isomorphic-unfetch"
import Layout from "../components/Layout"
import Banner from "../components/Banner"
import moment from "moment"
import { FORMAT_DATE } from "../utils/constants"
import { Alert, Button, Col, Container, Form, FormGroup, Input, Label, Spinner, Table } from "reactstrap"

const fetchData = async search => {
   const bonus = search ? `?fuzzy=${search}` : ""
   const res = await fetch(`${APP_URL}${ACT_LIST_ENDPOINT}${bonus}`)
   return await res.json()
}

const ActsListPage = ({ initialActs }) => {
   const [search, setSearch] = useState("")
   const [acts, setActs] = useState(initialActs || [])
   const [isError, setIsError] = useState(false)
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
      try {
         setActs(await fetchData(search))
         setIsLoading(false)
      } catch (error) {
         console.error(error)
         setIsError(true)
         setActs([])
         setIsLoading(false)
      }
   }

   return (
      <Layout>
         <Banner title="Actes d'un établissement de santé" />
         <Container>
            <Form onSubmit={onSubmit}>
               <FormGroup row inline>
                  <Label for="email" sm={"auto"}>
                     Établissement de santé
                  </Label>
                  <Col sm={7}>
                     <Input
                        type="text"
                        name="es"
                        id="es"
                        placeholder="Rechercher un dossier par numéro, type de profil examiné, ..."
                        value={search}
                        onChange={onChange}
                     />
                  </Col>
                  <Col sm={2} className="text-align-right">
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
                  Erreur de base de données
               </Alert>
            )}

            {!isError && !isLoading && (
               <Table striped bordered responsive className="mt-5">
                  <thead>
                     <tr>
                        <th>N° interne</th>
                        <th>N° PV</th>
                        <th>Date</th>
                        <th>Type de profil</th>
                        <th></th>
                     </tr>
                  </thead>
                  <tbody>
                     {acts.map(act => (
                        <tr key={act.id}>
                           <td>{act.internal_number}</td>
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

ActsListPage.getInitialProps = async () => {
   return { initialActs: await fetchData() }
}

ActsListPage.propTypes = {
   initialActs: PropTypes.array,
}

export default withAuthSync(ActsListPage)
