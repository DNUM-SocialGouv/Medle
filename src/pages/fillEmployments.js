import React, { useState } from "react"
import PropTypes from "prop-types"
import { Alert, Col, Container, FormFeedback, Input, Row } from "reactstrap"

import { withAuthentication, getCurrentUser, buildAuthHeaders, redirectIfUnauthorized } from "../utils/auth"
import { isAllowed, EMPLOYMENT_CONSULTATION, EMPLOYMENT_MANAGEMENT } from "../utils/roles"
import Layout from "../components/Layout"
import AccordionEmploymentsMonth, {
  hasErrors,
  fetchDataMonth,
  updateDataMonth,
} from "../components/AccordionEmploymentsMonth"
import { Title1, Title2, Label, ValidationButton } from "../components/StyledComponents"
import { isEmpty } from "../utils/misc"
import { now } from "../utils/date"
import { logError } from "../utils/logger"
import { STATUS_400_BAD_REQUEST, STATUS_401_UNAUTHORIZED, STATUS_403_FORBIDDEN } from "../utils/http"

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

const FillEmploymentsPage = ({
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

  const previousMonths = allMonths && allMonths.length ? allMonths.slice(1) : []

  const handleChange = e => {
    e.preventDefault()

    setDataMonth({ ...dataMonth, [e.target.name]: e.target.value.trim() })
  }

  const update = async monthNumber => {
    setErrors({})

    const errors = hasErrors(dataMonth)

    if (!isEmpty(errors)) {
      setErrors({ ...errors, general: "Erreur de saisie" })
      return
    }

    try {
      await updateDataMonth({ hospitalId: hospital.id, year, month: monthNumber, dataMonth })

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

        <p className="font-italic text-center mb-0">
          {"Veuillez indiquer le nombre d'ETP pour les différents profils de votre UMJ/IML."}
        </p>
        <p className="text-center mb-5">
          <small>
            Les prochains mois, ces données seront pré-remplies et modifiables. Leur exactitude reste sous votre
            responsabilité.
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
                invalid={errors && !!errors.doctors}
                placeholder="Nombre d'ETP"
                value={(dataMonth && dataMonth["doctors"]) || ""}
                onChange={event => handleChange(event, currentMonth)}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.doctors}</FormFeedback>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="secretaries">Secrétaire</Label>
              <Input
                name="secretaries"
                invalid={errors && !!errors.secretaries}
                placeholder="Nombre d'ETP"
                value={(dataMonth && dataMonth["secretaries"]) || ""}
                onChange={event => handleChange(event, currentMonth)}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.secretaries}</FormFeedback>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="nursings">Aide soignant.e</Label>
              <Input
                name="nursings"
                invalid={errors && !!errors.nursings}
                placeholder="Nombre d'ETP"
                value={(dataMonth && dataMonth["nursings"]) || ""}
                onChange={event => handleChange(event, currentMonth)}
                autoComplete="off"
              />

              <FormFeedback>{errors && errors.nursings}</FormFeedback>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="executives">Cadre de santé</Label>
              <Input
                name="executives"
                invalid={errors && !!errors.executives}
                placeholder="Nombre d'ETP"
                value={(dataMonth && dataMonth["executives"]) || ""}
                onChange={event => handleChange(event, currentMonth)}
                autoComplete="off"
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
                value={(dataMonth && dataMonth["ides"]) || ""}
                onChange={event => handleChange(event, currentMonth)}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.ides}</FormFeedback>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="auditoriumAgents">{"Agent d'amphithéâtre"}</Label>
              <Input
                name="auditoriumAgents"
                invalid={errors && !!errors.auditoriumAgents}
                placeholder="Nombre d'ETP"
                value={(dataMonth && dataMonth["auditoriumAgents"]) || ""}
                onChange={event => handleChange(event, currentMonth)}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.auditoriumAgents}</FormFeedback>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="psychologists">Psychologue</Label>
              <Input
                name="psychologists"
                invalid={errors && !!errors.psychologists}
                placeholder="Nombre d'ETP"
                value={(dataMonth && dataMonth["psychologists"]) || ""}
                onChange={event => handleChange(event, currentMonth)}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.psychologists}</FormFeedback>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="others">Autres</Label>
              <Input
                name="others"
                invalid={errors && !!errors.others}
                placeholder="Nombre d'ETP"
                value={(dataMonth && dataMonth["others"]) || ""}
                onChange={event => handleChange(event, currentMonth)}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.others}</FormFeedback>
            </Col>
          </Row>
          {isAllowed(currentUser.role, EMPLOYMENT_MANAGEMENT) && (
            <div className="text-center mt-5">
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
              onChange={event => handleChange(event, month)}
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

  const allMonths = new Array(parseInt(currentMonth))
    .fill(0)
    .map((_, index) => (index + 1).toString().padStart(2, "0"))
    .reverse()
    .map(elt => ({ monthName: NAME_MONTHS[elt] + " " + currentYear, month: elt }))

  return {
    currentYear,
    currentMonth,
    allMonths,
  }
}

const buildErrorText = (error, conf, defaultValue) => (error && error.status && conf[error.status]) || defaultValue

FillEmploymentsPage.getInitialProps = async ctx => {
  const { currentYear, currentMonth, allMonths } = buildDates()

  try {
    const authHeaders = buildAuthHeaders(ctx)

    const { hospital } = getCurrentUser(ctx)

    if (!hospital || !hospital.id) {
      throw new Error("Vous n'avez pas d'établissement de santé à gérer.")
    }

    const json = await fetchDataMonth({
      hospitalId: hospital.id,
      year: currentYear,
      month: currentMonth,
      authHeaders,
    })

    return {
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
      "Erreur interne",
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
