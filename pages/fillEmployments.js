import React, { useState } from "react"
import PropTypes from "prop-types"
import nextCookie from "next-cookies"
import { API_URL, EMPLOYMENTS_ENDPOINT } from "../config"
import fetch from "isomorphic-unfetch"
import moment from "moment"
import { Alert, Button, Col, Container, FormFeedback, Input, Row } from "reactstrap"
import {
   STATUS_200_OK,
   STATUS_400_BAD_REQUEST,
   STATUS_404_NOT_FOUND,
   STATUS_405_METHOD_NOT_ALLOWED,
   STATUS_500_INTERNAL_SERVER_ERROR,
} from "../utils/HttpStatus"

import Layout from "../components/Layout"
import AccordionEmploymentsMonth from "../components/AccordionEmploymentsMonth"
import { Title1, Title2, Label, ValidationButton } from "../components/StyledComponents"

const FillEmploymentsPage = ({ currentMonth, currentMonthName, error, numbers, allMonths, year, hospitalId }) => {
   const [errors, setErrors] = useState(error)
   const [success, setSuccess] = useState("")

   const [dataMonth, setDataMonth] = useState(numbers)

   const previousMonths = allMonths && allMonths.length ? allMonths.slice(1) : []

   const handleChange = e => {
      e.preventDefault()

      setDataMonth({ ...dataMonth, [e.target.name]: e.target.value })
   }

   const update = async monthNumber => {
      console.log("monthNumber", monthNumber)

      let result
      try {
         result = await fetch(API_URL + EMPLOYMENTS_ENDPOINT + `/${hospitalId}/${year}/${monthNumber}`, {
            method: "PUT",
            body: JSON.stringify(dataMonth),
         })
         const json = await result.json()

         if (result.status !== STATUS_200_OK) {
            //throw new Error(json && json.message ? json.message : "")
            console.error("Error", json.error)
            return { error: json.error }
         }
         setSuccess("Vos informations ont bien été enregistrées.")
      } catch (error) {
         console.error(error)
         return { error: "Erreur backoffice 2" }
      }
   }

   return (
      <Layout>
         <Title1 className="mt-5 mb-5">{"Déclaration du personnel"}</Title1>
         <Container style={{ maxWidth: 720 }}>
            <Title2 className="mb-4 text-capitalize">{currentMonthName}</Title2>

            <p className="font-italic text-center mb-0">
               {"Veuillez indiquer le nombre d'ETP pour les différents profils de votre UMJ."}
            </p>
            <p className="text-center mb-5">
               <small>
                  Les prochains mois, ces données seront pré-remplies et modifiables. Leur exactitude reste sous votre
                  responsabilité.
               </small>
            </p>

            {/* {!isEmpty(errors) && <Alert color="danger">{"Veuillez renseigner les éléments en rouge"}</Alert>} */}

            {success && <Alert color="primary">{success}</Alert>}

            <>
               <Row>
                  <Col className="mr-3">
                     <Label htmlFor="doctors">Médecin</Label>
                     <Input
                        name="doctors"
                        invalid={errors && !!errors.doctors}
                        placeholder="Nombre d'ETP"
                        value={dataMonth && dataMonth["doctors"]}
                        onChange={event => handleChange(event, currentMonth)}
                     />
                     <FormFeedback>{errors && errors.doctors}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="secretaries">Secrétaire</Label>
                     <Input
                        name="secretaries"
                        invalid={errors && !!errors.secretaries}
                        placeholder="Nombre d'ETP"
                        value={dataMonth && dataMonth["secretaries"]}
                        onChange={event => handleChange(event, currentMonth)}
                     />
                     <FormFeedback>{errors && errors.secretaries}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="nursings">Aide soignant.e</Label>
                     <Input
                        name="nursings"
                        invalid={errors && !!errors.nursings}
                        placeholder="Nombre d'ETP"
                        value={dataMonth && dataMonth["nursings"]}
                        onChange={event => handleChange(event, currentMonth)}
                     />

                     <FormFeedback>{errors && errors.nursings}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="executives">Cadre de santé</Label>
                     <Input
                        name="executives"
                        invalid={errors && !!errors.executives}
                        placeholder="Nombre d'ETP"
                        value={dataMonth && dataMonth["executives"]}
                        onChange={event => handleChange(event, currentMonth)}
                     />
                     <FormFeedback>{errors && errors.executives}</FormFeedback>
                  </Col>
               </Row>
               <Row className={"mt-2"}>
                  <Col className="mr-3">
                     <Label htmlFor="ides">IDE</Label>
                     <Input
                        name="ides"
                        invalid={errors && !!errors.ides}
                        placeholder="Nombre d'ETP"
                        value={dataMonth && dataMonth["ides"]}
                        onChange={event => handleChange(event, currentMonth)}
                     />
                     <FormFeedback>{errors && errors.ides}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="auditoriumAgents">{"Agent d'amphithéâtre"}</Label>
                     <Input
                        name="auditoriumAgents"
                        invalid={errors && !!errors.auditoriumAgents}
                        placeholder="Nombre d'ETP"
                        value={dataMonth && dataMonth["auditoriumAgents"]}
                        onChange={event => handleChange(event, currentMonth)}
                     />
                     <FormFeedback>{errors && errors.auditoriumAgents}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="psychologists">Psychologue</Label>
                     <Input
                        name="psychologists"
                        invalid={errors && !!errors.psychologists}
                        placeholder="Nombre d'ETP"
                        value={dataMonth && dataMonth["psychologists"]}
                        onChange={event => handleChange(event, currentMonth)}
                     />
                     <FormFeedback>{errors && errors.psychologists}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="others">Autres</Label>
                     <Input
                        name="others"
                        invalid={errors && !!errors.others}
                        placeholder="Nombre d'ETP"
                        value={dataMonth && dataMonth["others"]}
                        onChange={event => handleChange(event, currentMonth)}
                     />
                     <FormFeedback>{errors && errors.others}</FormFeedback>
                  </Col>
               </Row>

               <div className="text-center mt-5">
                  <ValidationButton color="primary" size="lg" className="center" onClick={() => update(currentMonth)}>
                     Valider
                  </ValidationButton>
               </div>

               <Title2 className="mt-5 mb-4">{"Mois précédents"}</Title2>

               {previousMonths.map(({ monthName, month }) => (
                  <AccordionEmploymentsMonth
                     key={month}
                     monthName={monthName}
                     month={month}
                     year={year}
                     hospitalId={hospitalId}
                     onChange={event => handleChange(event, month)}
                     update={update}
                  />
               ))}
            </>
         </Container>
      </Layout>
   )
}

FillEmploymentsPage.getInitialProps = async ctx => {
   console.log("dans getInitialProps")

   const { token, role, hospitalId } = nextCookie(ctx)

   if (!hospitalId) {
      return { error: "Vous n'avez pas d'établissement de santé à gérer." }
   }

   const NAME_MONTHS = {
      "01": "janvier",
      "02": "février",
      "03": "mars",
      "04": "avril",
      "05": "mai",
      "06": "juin",
      "07": "juillet",
      "08": "août",
      "09": "septembre",
      "10": "octobre",
      "11": "novembre",
      "12": "décembre",
   }

   const currentMonth = moment().format("MM")
   const currentYear = moment().format("YYYY")
   const allMonths = new Array(parseInt(currentMonth))
      .fill(0)
      .map((_, index) => (index + 1).toString().padStart(2, "0"))
      .reverse()
      .map(elt => ({ monthName: NAME_MONTHS[elt] + " " + currentYear, month: elt }))

   console.log("allMonths", allMonths)

   let result

   try {
      result = await fetch(API_URL + EMPLOYMENTS_ENDPOINT + `/${hospitalId}/${currentYear}/${currentMonth}`, {
         method: "GET",
      })
      const json = await result.json()

      if (result.status !== STATUS_200_OK) {
         //throw new Error(json && json.message ? json.message : "")
         return { error: "Erreur backoffice 1" }
      }
      return {
         currentMonth,
         currentMonthName: NAME_MONTHS[currentMonth] + " " + currentYear,
         numbers: json,
         allMonths,
         year: currentYear,
         hospitalId,
      }
   } catch (error) {
      console.error(error)
      return { error: "Erreur backoffice 2" }
   }
}

FillEmploymentsPage.propTypes = {
   currentMonth: PropTypes.string,
   currentMonthName: PropTypes.string,
   numbers: PropTypes.object,
   allMonths: PropTypes.array,
   error: PropTypes.string,
   hospitalId: PropTypes.string.isRequired,
   year: PropTypes.string.isRequired,
}

FillEmploymentsPage.defaultProps = {
   numbers: {},
}

export default FillEmploymentsPage
