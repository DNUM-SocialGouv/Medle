import React, { useState } from "react"
import { withAuthSync } from "../utils/auth"
import Layout from "../components/layout"
import { Button, Col, Container, Form, FormGroup, Label, Input, Row, Table } from "reactstrap"
import colors from "../constants/colors"

const ActsListPage = () => {
   const [healthCenter, setHealthCenter] = useState("")

   const onChange = e => {
      setHealthCenter(e.target.value)
   }

   return (
      <Layout>
         <div style={{ backgroundColor: "white" }} className="pt-3">
            <Container>
               <h1 className={"mt-3 mb-3"}>{"Actes d'un établissement de santé"}</h1>
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
                           autoFocus
                        />
                     </Col>
                     <Col sm={2} className="text-align-right">
                        <Button>Chercher</Button>
                     </Col>
                  </FormGroup>
               </Form>
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
                     <tr>
                        <td>2019/32418</td>
                        <td>Examen somatique de victime</td>
                        <td>11/10/2019</td>
                        <td>15:03</td>
                        <td>Établissement de santé</td>
                        <td>2</td>
                        <td></td>
                     </tr>
                     <tr>
                        <td>2019/032798</td>
                        <td>Autopsie</td>
                        <td>11/10/2019</td>
                        <td>13:22</td>
                        <td>Police/gendarmerie</td>
                        <td></td>
                        <td></td>
                     </tr>
                     <tr>
                        <td>2019/032536</td>
                        <td>Examen somatique de gardé à vue</td>
                        <td>11/10/2019</td>
                        <td>17:13</td>
                        <td>Établissement de santé</td>
                        <td></td>
                        <td></td>
                     </tr>
                     <tr>
                        <td>2019/32418</td>
                        <td>Examen somatique de victime</td>
                        <td>11/10/2019</td>
                        <td>15:03</td>
                        <td>Établissement de santé</td>
                        <td>2</td>
                        <td></td>
                     </tr>
                     <tr>
                        <td>2019/32418</td>
                        <td>Examen somatique de victime</td>
                        <td>11/10/2019</td>
                        <td>15:03</td>
                        <td>Établissement de santé</td>
                        <td>2</td>
                        <td></td>
                     </tr>
                  </tbody>
               </Table>
            </Container>
         </div>
      </Layout>
   )
}

export default withAuthSync(ActsListPage)
