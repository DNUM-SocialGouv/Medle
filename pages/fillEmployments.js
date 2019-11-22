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
import { isEmpty } from "../utils/misc"

const validAct = () => {
   console.log("Validation des ETP")
}

const FillEmploymentsPage = ({ currentMonth, currentMonthName, error, numbers, allMonths }) => {
   const [errors, setErrors] = useState(error)

   const previousMonths = allMonths && allMonths.length ? allMonths.slice(1) : []

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

            {!isEmpty(errors) && <Alert color="danger">{errors || "Veuillez renseigner les éléments en rouge"}</Alert>}

            {isEmpty(errors) && (
               <>
                  <Row>
                     <Col className="mr-3">
                        <Label htmlFor="doctorsNumber">Médecin</Label>
                        <Input
                           id="doctorsNumber"
                           invalid={errors && !!errors.doctorsNumber}
                           placeholder="Nombre d'ETP"
                           value={numbers[currentMonth] && numbers[currentMonth]["doctors"]}
                        />
                        <FormFeedback>{errors && errors.doctorsNumber}</FormFeedback>
                     </Col>
                     <Col className="mr-3">
                        <Label htmlFor="secretariesNumber">Secrétaire</Label>
                        <Input
                           id="secretariesNumber"
                           invalid={errors && !!errors.secretariesNumber}
                           placeholder="Nombre d'ETP"
                           value={numbers[currentMonth] && numbers[currentMonth]["secretaries"]}
                        />
                        <FormFeedback>{errors && errors.secretariesNumber}</FormFeedback>
                     </Col>
                     <Col className="mr-3">
                        <Label htmlFor="nursingsNumbers">Aide soignant.e</Label>
                        <Input
                           id="nursingsNumbers"
                           invalid={errors && !!errors.nursingsNumbers}
                           placeholder="Nombre d'ETP"
                           value={numbers[currentMonth] && numbers[currentMonth]["nursings"]}
                        />

                        <FormFeedback>{errors && errors.nursingsNumbers}</FormFeedback>
                     </Col>
                     <Col className="mr-3">
                        <Label htmlFor="executivesNumber">Cadre de santé</Label>
                        <Input
                           id="executivesNumber"
                           invalid={errors && !!errors.executivesNumber}
                           placeholder="Nombre d'ETP"
                           value={numbers[currentMonth] && numbers[currentMonth]["executives"]}
                        />
                        <FormFeedback>{errors && errors.executivesNumber}</FormFeedback>
                     </Col>
                  </Row>
                  <Row className={"mt-2"}>
                     <Col className="mr-3">
                        <Label htmlFor="idesNumber">IDE</Label>
                        <Input
                           id="idesNumber"
                           invalid={errors && !!errors.idesNumber}
                           placeholder="Nombre d'ETP"
                           value={numbers[currentMonth] && numbers[currentMonth]["ides"]}
                        />
                        <FormFeedback>{errors && errors.idesNumber}</FormFeedback>
                     </Col>
                     <Col className="mr-3">
                        <Label htmlFor="auditoriumAgentsNumber">{"Agent d'amphithéâtre"}</Label>
                        <Input
                           id="auditoriumAgentsNumber"
                           invalid={errors && !!errors.auditoriumAgentsNumber}
                           placeholder="Nombre d'ETP"
                           value={numbers[currentMonth] && numbers[currentMonth]["auditoriumAgents"]}
                        />
                        <FormFeedback>{errors && errors.auditoriumAgentsNumber}</FormFeedback>
                     </Col>
                     <Col className="mr-3">
                        <Label htmlFor="psychologistsNumber">Psychologue</Label>
                        <Input
                           id="psychologistsNumber"
                           invalid={errors && !!errors.psychologistsNumber}
                           placeholder="Nombre d'ETP"
                           value={numbers[currentMonth] && numbers[currentMonth]["psychologists"]}
                        />
                        <FormFeedback>{errors && errors.psychologistsNumber}</FormFeedback>
                     </Col>
                     <Col className="mr-3">
                        <Label htmlFor="othersNumber">Autres</Label>
                        <Input
                           id="othersNumber"
                           invalid={errors && !!errors.othersNumber}
                           placeholder="Nombre d'ETP"
                           value={numbers[currentMonth] && numbers[currentMonth]["others"]}
                        />
                        <FormFeedback>{errors && errors.othersNumber}</FormFeedback>
                     </Col>
                  </Row>

                  <div className="text-center mt-5">
                     <ValidationButton color="primary" size="lg" className="center" onClick={validAct}>
                        Valider
                     </ValidationButton>
                  </div>

                  <Title2 className="mt-5 mb-4">{"Mois précédents"}</Title2>

                  {previousMonths.map(({ monthName, monthNumber }) => (
                     <AccordionEmploymentsMonth
                        key={monthNumber}
                        monthName={monthName}
                        monthNumber={monthNumber}
                        numbers={numbers}
                     />
                  ))}
               </>
            )}
         </Container>
      </Layout>
   )
}

FillEmploymentsPage.getInitialProps = async ctx => {
   const { token, role, hospitalId } = nextCookie(ctx)

   if (!hospitalId) {
      return { error: "Vous n'avez pas d'établissement de santé à gérer." }
   }

   console.log("APP url", API_URL)
   console.log("Empployment endoipoit", EMPLOYMENTS_ENDPOINT)

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
      .map(elt => ({ monthName: NAME_MONTHS[elt] + " " + currentYear, monthNumber: elt }))

   console.log("allMonths", allMonths)

   let result

   try {
      result = await fetch(API_URL + EMPLOYMENTS_ENDPOINT + `/${hospitalId}/${currentYear}`, {
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
}

export default FillEmploymentsPage
