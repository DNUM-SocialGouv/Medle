import React, { useState, useEffect } from "react"
import { withAuthSync } from "../utils/auth"
import { ACT_LIST_ENDPOINT } from "../config"
import fetch from "isomorphic-unfetch"
import Layout from "../components/Layout"
import Banner from "../components/Banner"
import { Alert, Button, Col, Container, Form, FormGroup, Input, Label, Spinner, Table } from "reactstrap"

const ActsListPage = () => {
   const [healthCenter, setHealthCenter] = useState("")
   const [acts, setActs] = useState([])
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
            setActs(json.actes)
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
                        <th>N° procédure</th>
                        <th>{"Type d'acte"}</th>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>{"Lieu d'acte"}</th>
                        <th>{"Nb d'examens"}</th>
                        <th>Nb de radios</th>
                     </tr>
                  </thead>
                  <tbody>
                     {acts.map(act => (
                        <tr key={act.id}>
                           <td>{act.num_procedure}</td>
                           <td>{act.type_acte}</td>
                           <td>{act.date_creation}</td>
                           <td></td>
                           <td>{act.lieu_acte}</td>
                           <td></td>
                           <td></td>
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
