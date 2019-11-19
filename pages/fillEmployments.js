import React, { useState } from "react"
import PropTypes from "prop-types"
import Router from "next/router"
import fetch from "isomorphic-unfetch"
import { Alert, Button, Col, Container, FormFeedback, Input, Row } from "reactstrap"
import Layout from "../components/Layout"
import AccordionEmploymentsMonth from "../components/AccordionEmploymentsMonth"
import { Title1, Title2, Label, ValidationButton } from "../components/StyledComponents"
import { isEmpty } from "../utils/misc"

import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos"

const validAct = () => {
   console.log("Validation des ETP")
}

const FillEmployments = () => {
   const [errors, setErrors] = useState()
   return (
      <Layout>
         <Title1 className="mt-5 mb-5">{"Déclaration du personnel"}</Title1>
         <Container style={{ maxWidth: 720 }}>
            <Title2 className="mb-4">{"Janvier 2019"}</Title2>

            <p className="font-italic text-center mb-0">
               {"Veuillez indiquer le nombre d'ETP pour les différents profils de votre UMJ."}
            </p>
            <p className="text-center mb-5">
               <small>
                  Les prochains mois, ces données seront pré-remplies et modifiables. Leur exactitude reste sous votre
                  responsabilité.
               </small>
            </p>

            {!isEmpty(errors) && (
               <Alert color="danger">{errors.general || "Veuillez renseigner les éléments en rouge"}</Alert>
            )}
            <Row>
               <Col className="mr-3">
                  <Label htmlFor="doctorsNumber">Médecin</Label>
                  <Input id="doctorsNumber" invalid={errors && !!errors.doctorsNumber} placeholder="Nombre d'ETP" />
                  <FormFeedback>{errors && errors.doctorsNumber}</FormFeedback>
               </Col>
               <Col className="mr-3">
                  <Label htmlFor="secretariesNumber">Secrétaire</Label>
                  <Input
                     id="secretariesNumber"
                     invalid={errors && !!errors.secretariesNumber}
                     placeholder="Nombre d'ETP"
                  />
                  <FormFeedback>{errors && errors.secretariesNumber}</FormFeedback>
               </Col>
               <Col className="mr-3">
                  <Label htmlFor="nursingsNumbers">Aide soignant.e</Label>
                  <Input id="nursingsNumbers" invalid={errors && !!errors.nursingsNumbers} placeholder="Nombre d'ETP" />
                  <FormFeedback>{errors && errors.nursingsNumbers}</FormFeedback>
               </Col>
               <Col className="mr-3">
                  <Label htmlFor="executivesNumber">Cadre de santé</Label>
                  <Input
                     id="executivesNumber"
                     invalid={errors && !!errors.executivesNumber}
                     placeholder="Nombre d'ETP"
                  />
                  <FormFeedback>{errors && errors.executivesNumber}</FormFeedback>
               </Col>
            </Row>
            <Row className={"mt-2"}>
               <Col className="mr-3">
                  <Label htmlFor="idesNumber">IDE</Label>
                  <Input id="idesNumber" invalid={errors && !!errors.idesNumber} placeholder="Nombre d'ETP" />
                  <FormFeedback>{errors && errors.idesNumber}</FormFeedback>
               </Col>
               <Col className="mr-3">
                  <Label htmlFor="auditoriumAgentsNumber">{"Agent d'amphithéâtre"}</Label>
                  <Input
                     id="auditoriumAgentsNumber"
                     invalid={errors && !!errors.auditoriumAgentsNumber}
                     placeholder="Nombre d'ETP"
                  />
                  <FormFeedback>{errors && errors.auditoriumAgentsNumber}</FormFeedback>
               </Col>
               <Col className="mr-3">
                  <Label htmlFor="psychologistsNumber">Psychologue</Label>
                  <Input
                     id="psychologistsNumber"
                     invalid={errors && !!errors.psychologistsNumber}
                     placeholder="Nombre d'ETP"
                  />
                  <FormFeedback>{errors && errors.psychologistsNumber}</FormFeedback>
               </Col>
               <Col className="mr-3">
                  <Label htmlFor="otherEmploymentsNumber">Autres</Label>
                  <Input
                     id="otherEmploymentsNumber"
                     invalid={errors && !!errors.otherEmploymentsNumber}
                     placeholder="Nombre d'ETP"
                  />
                  <FormFeedback>{errors && errors.otherEmploymentsNumber}</FormFeedback>
               </Col>
            </Row>

            <div className="text-center mt-5">
               <ValidationButton color="primary" size="lg" className="center" onClick={validAct}>
                  Valider
               </ValidationButton>
            </div>

            <Title2 className="mt-5 mb-4">{"Mois précédents"}</Title2>

            <AccordionEmploymentsMonth title="Août 2019" data={{}} />
            <AccordionEmploymentsMonth title="Juillet 2019" data={{}} />
            <AccordionEmploymentsMonth title="Juin 2019" data={{}} />
            <AccordionEmploymentsMonth title="Mai 2019" data={{}} />
         </Container>
      </Layout>
   )
}

FillEmployments.propTypes = {
   askerValues: PropTypes.array,
}

export default FillEmployments
