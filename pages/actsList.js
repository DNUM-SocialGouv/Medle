import React, { useState, useEffect } from "react"
import Link from "next/link"
import { withAuthSync } from "../utils/auth"
import { ACT_LIST_ENDPOINT } from "../config"
import fetch from "isomorphic-unfetch"
import Layout from "../components/Layout"
import Banner from "../components/Banner"
import moment from "moment"
import { FORMAT_DATE } from "../utils/constants"
import { Alert, Button, Col, Container, Form, FormGroup, Input, Label, Spinner, Table } from "reactstrap"

const ActsListPage = () => {
   const [healthCenter, setHealthCenter] = useState("")
   const [cases, setCases] = useState([])
   const [isError, setIsError] = useState(false)
   const [isLoading, setIsLoading] = useState(false)

   const onChange = e => {
      setHealthCenter(e.target.value)
   }

   useEffect(() => {
      const fetchData = async () => {
         let json
         try {
            const res = await fetch(ACT_LIST_ENDPOINT)
            json = await res.json()
            setCases(json)
         } catch (error) {
            console.error(error)
            setIsError(true)
         }
         setIsLoading(false)
      }

      setIsLoading(true)
      setIsError(false)
      fetchData()
   }, [])

   return (
      <Layout>
         <Banner title="Actes d'un établissement de santé" />
         <Container>
            <Form>
               <FormGroup row inline>
                  <Label for="email" sm={"auto"}>
                     Établissement de santé
                  </Label>
                  <Col sm={7}>
                     <Input
                        type="text"
                        name="es"
                        id="es"
                        placeholder="Ex: Nice"
                        value={healthCenter}
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
                     {cases.map(aCase => (
                        <tr key={aCase.id}>
                           <td>{aCase.internal_number}</td>
                           <td>
                              {aCase.acts && aCase.acts.length === 1
                                 ? aCase.acts[0].pv_number
                                 : "Comprend plusieurs actes"}
                           </td>
                           <td>{aCase.acts && aCase.acts.length === 1 ? aCase.acts[0].examination_date : ""}</td>
                           <td>{aCase.case_type}</td>
                           <td>
                              <Link href={`/actDetail/${aCase.id}`}>
                                 <a>{aCase.acts && aCase.acts.length === 1 ? "Modifier / voir" : ">"}</a>
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

export default withAuthSync(ActsListPage)
