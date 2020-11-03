import React, { useState } from "react"
import PropTypes from "prop-types"
import Link from "next/link"

import { Alert, Col, Container, FormFeedback, Input, Row } from "reactstrap"

import { withAuthentication, getCurrentUser, buildAuthHeaders, redirectIfUnauthorized } from "../utils/auth"
import { isAllowed, EMPLOYMENT_CONSULTATION, EMPLOYMENT_MANAGEMENT } from "../utils/roles"
import Badge from "../components/Badge"
import Layout from "../components/Layout"
import AccordionEmploymentsMonth, { hasErrors } from "../components/AccordionEmploymentsMonth"

import { findEmployment, updateEmployment } from "../clients/employments"

import { searchReferenceForMonth } from "../clients/employments-references"
import { Title1, Title2, Label, ValidationButton } from "../components/StyledComponents"
import { isEmpty, pluralize } from "../utils/misc"
import { now, NAME_MONTHS } from "../utils/date"
import { logError } from "../utils/logger"
import { STATUS_400_BAD_REQUEST, STATUS_401_UNAUTHORIZED, STATUS_403_FORBIDDEN } from "../utils/http"

const makeLabel = (number) => (number ? `${number} ETP prévu${pluralize(number)}` : null)

const FillEmploymentsPage = ({
  etpBase,
  currentMonth,
  currentMonthName,
  error,
  dataMonth: _dataMonth,
  allMonths,
  year,
  currentUser,
}) => {
  const [errors, setErrors] = useState(error)
  const [success, setSuccess] = useState("")

  const [dataMonth, setDataMonth] = useState(_dataMonth)

  const { hospital } = currentUser

  const previousMonths = allMonths?.length ? allMonths.slice(1) : []

  const handleChange = (e) => {
    e.preventDefault()

    setDataMonth({ ...dataMonth, [e.target.name]: e.target.value.trim() })
  }

  const update = async (monthNumber) => {
    setErrors({})

    const errors = hasErrors(dataMonth)

    if (!isEmpty(errors)) {
      setErrors({ ...errors, general: "Erreur de saisie" })
      return
    }

    try {
      await updateEmployment({ hospitalId: hospital.id, year, month: monthNumber, dataMonth })

      setSuccess("Vos informations ont bien été enregistrées.")
    } catch (error) {
      logError(error)
      setErrors({ general: "Erreur lors de la mise à jour des ETP" })
    }
  }

  if (!hospital || !hospital.id)
    return (
      <Layout page="fillEmployments" currentUser={currentUser}>
        <Title1 className="mt-5 mb-5">{"Déclaration du personnel"}</Title1>
        <Container style={{ maxWidth: 720 }}>
          <Title2 className="mb-4 text-capitalize">{currentMonthName}</Title2>
          <Alert color="danger">
            {"Cette fonctionnalité n'est disponible que si vous avez un établissement d'appartenance."}
          </Alert>
        </Container>
      </Layout>
    )

  return (
    <Layout page="fillEmployments" currentUser={currentUser}>
      <Title1 className="mt-5 mb-5">{"Déclaration du personnel"}</Title1>
      <Container style={{ maxWidth: 720 }}>
        <Title2 className="mb-4 text-capitalize">{currentMonthName}</Title2>

        <p className="mb-0 text-center font-italic">
          {"Veuillez indiquer le nombre d'ETP pour les différents profils de votre UMJ/IML."}
        </p>
        <p className="mb-5 text-center">
          <small>
            Attention, un ETP est un Equivalent Temps Plein et non un poste.{" "}
            <Link href={"/faq"}>
              <a>{"+ d'infos dans la FAQ"}</a>
            </Link>
            .
          </small>
        </p>

        {!isEmpty(errors) && <Alert color="danger">{errors.general || "Erreur serveur"}</Alert>}

        {success && <Alert color="primary">{success}</Alert>}

        <>
          <Row>
            <Col className="mr-3">
              <Label htmlFor="doctors">Médecin</Label>
              <Input
                name="doctors"
                type="number"
                min={0}
                step="0.05"
                invalid={errors && !!errors.doctors}
                placeholder="ex: 2,1"
                value={(dataMonth && dataMonth["doctors"]) || ""}
                onChange={(event) => handleChange(event, currentMonth)}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.doctors}</FormFeedback>

              <Badge value={makeLabel(etpBase?.doctors)}></Badge>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="secretaries">Secrétaire</Label>
              <Input
                name="secretaries"
                type="number"
                min={0}
                step="0.05"
                invalid={errors && !!errors.secretaries}
                placeholder="ex: 2,1"
                value={(dataMonth && dataMonth["secretaries"]) || ""}
                onChange={(event) => handleChange(event, currentMonth)}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.secretaries}</FormFeedback>
              <Badge value={makeLabel(etpBase?.secretaries)}></Badge>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="nursings">Aide soignant.e</Label>
              <Input
                name="nursings"
                type="number"
                min={0}
                step="0.05"
                invalid={errors && !!errors.nursings}
                placeholder="ex: 2,1"
                value={(dataMonth && dataMonth["nursings"]) || ""}
                onChange={(event) => handleChange(event, currentMonth)}
                autoComplete="off"
              />

              <FormFeedback>{errors && errors.nursings}</FormFeedback>
              <Badge value={makeLabel(etpBase?.nursings)}></Badge>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="executives">Cadre de santé</Label>
              <Input
                name="executives"
                type="number"
                min={0}
                step="0.05"
                invalid={errors && !!errors.executives}
                placeholder="ex: 2,1"
                value={(dataMonth && dataMonth["executives"]) || ""}
                onChange={(event) => handleChange(event, currentMonth)}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.executives}</FormFeedback>
              <Badge value={makeLabel(etpBase?.executives)}></Badge>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col className="mr-3">
              <Label htmlFor="ides">IDE</Label>
              <Input
                name="ides"
                type="number"
                min={0}
                step="0.05"
                invalid={errors && !!errors.ides}
                placeholder="ex: 2,1"
                value={(dataMonth && dataMonth["ides"]) || ""}
                onChange={(event) => handleChange(event, currentMonth)}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.ides}</FormFeedback>
              <Badge value={makeLabel(etpBase?.ides)}></Badge>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="auditoriumAgents">{"Agent d'amphi."}</Label>
              <Input
                name="auditoriumAgents"
                type="number"
                min={0}
                step="0.05"
                invalid={errors && !!errors.auditoriumAgents}
                placeholder="ex: 2,1"
                value={(dataMonth && dataMonth["auditoriumAgents"]) || ""}
                onChange={(event) => handleChange(event, currentMonth)}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.auditoriumAgents}</FormFeedback>
              <Badge value={makeLabel(etpBase?.auditoriumAgents)}></Badge>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="others">Autres</Label>
              <Input
                name="others"
                type="number"
                min={0}
                step="0.05"
                invalid={errors && !!errors.others}
                placeholder="ex: 2,1"
                value={(dataMonth && dataMonth["others"]) || ""}
                onChange={(event) => handleChange(event, currentMonth)}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.others}</FormFeedback>
              <Badge value={makeLabel(etpBase?.others)}></Badge>
            </Col>
            <Col className="mr-3"></Col>
          </Row>
          {isAllowed(currentUser?.role, EMPLOYMENT_MANAGEMENT) && (
            <div className="mt-5 text-center">
              <ValidationButton color="primary" size="lg" className="center" onClick={() => update(currentMonth)}>
                Valider
              </ValidationButton>
            </div>
          )}
          {!!previousMonths.length && <Title2 className="mt-5 mb-4">{"Mois précédents"}</Title2>}
          {previousMonths.map(({ monthName, month }) => (
            <AccordionEmploymentsMonth
              key={month}
              monthName={monthName}
              month={month}
              year={year}
              hospitalId={hospital.id}
              onChange={(event) => handleChange(event, month)}
              update={update}
              currentUser={currentUser}
            />
          ))}
        </>
      </Container>
    </Layout>
  )
}

const buildDates = () => {
  const moment = now()
  const currentMonth = moment.format("MM")
  const currentYear = moment.format("YYYY")

  const allMonths = new Array(parseInt(currentMonth, 10))
    .fill(0)
    .map((_, index) => (index + 1).toString().padStart(2, "0"))
    .reverse()
    .map((elt) => ({ monthName: NAME_MONTHS[elt] + " " + currentYear, month: elt }))

  return {
    currentYear,
    currentMonth,
    allMonths,
  }
}

const buildErrorText = (error, conf, defaultValue) => (error && error.status && conf[error.status]) || defaultValue

FillEmploymentsPage.getInitialProps = async (ctx) => {
  const { currentYear, currentMonth, allMonths } = buildDates()

  try {
    const headers = buildAuthHeaders(ctx)

    const { hospital } = getCurrentUser(ctx)

    if (!hospital || !hospital.id) {
      throw new Error("Vous n'avez pas d'établissement de santé à gérer.")
    }

    const json = await findEmployment({
      hospitalId: hospital.id,
      year: currentYear,
      month: currentMonth,
      headers,
    })

    const etpReference = await searchReferenceForMonth({
      hospitalId: hospital.id,
      year: currentYear,
      month: currentMonth,
      headers,
    })

    return {
      etpBase: etpReference.reference,
      currentMonth,
      currentMonthName: NAME_MONTHS[currentMonth] + " " + currentYear,
      dataMonth: json,
      allMonths,
      year: currentYear,
    }
  } catch (error) {
    logError(error)

    redirectIfUnauthorized(error, ctx)

    const errorText = buildErrorText(
      error,
      {
        [STATUS_400_BAD_REQUEST]: "Paramètres incorrects",
        [STATUS_401_UNAUTHORIZED]: "Non autorisé",
        [STATUS_403_FORBIDDEN]: "Non autorisé",
      },
      "Erreur interne"
    )

    return {
      error: errorText,
      currentMonth,
      currentMonthName: NAME_MONTHS[currentMonth] + " " + currentYear,
      allMonths,
      year: currentYear,
    }
  }
}

FillEmploymentsPage.propTypes = {
  etpBase: PropTypes.object,
  year: PropTypes.string.isRequired,
  allMonths: PropTypes.array.isRequired,
  currentMonth: PropTypes.string.isRequired,
  currentMonthName: PropTypes.string.isRequired,
  dataMonth: PropTypes.object,
  error: PropTypes.string,
  currentUser: PropTypes.object,
}

FillEmploymentsPage.defaultProps = {
  dataMonth: {},
}

export default withAuthentication(FillEmploymentsPage, EMPLOYMENT_CONSULTATION)
