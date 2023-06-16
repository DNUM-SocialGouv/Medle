import ListAltIcon from "@material-ui/icons/ListAlt"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import PropTypes from "prop-types"
import React from "react"
import Select from "react-select"
import { Alert, Col, Container, Form, FormGroup, Row, Table } from "reactstrap"

import { exportEmployments, findLastEdit } from "../../clients/employments"
import { CurrentMonthEmployments, PassedMonthEmployments } from "../../components/EmploymentMonthData"
import FooterDocument from "../../components/FooterDocument"
import { SearchButton } from "../../components/form/SearchButton"
import Layout from "../../components/Layout"
import { InputDarker, Title1, Title2 } from "../../components/StyledComponents"
import { START_YEAR_MEDLE } from "../../config"
import { useDebounce } from "../../hooks/useDebounce"
import { withAuthentication } from "../../utils/auth"
import { extractMonthYear, isoToFr, NAME_MONTHS } from "../../utils/date"
import { footerDocumentFAQ } from "../../utils/documentsConstants"
import { getReferenceData } from "../../utils/init"
import { castArrayInMap } from "../../utils/object"
import { canAccessAllHospitals, EMPLOYMENT_CONSULTATION } from "../../utils/roles"
import { buildScope, hospitalsOfUser } from "../../utils/scope"
import { ariaLiveMessagesFR, reactSelectCustomTheme } from "../../utils/select"

function buildEmploymentDataMonth({ currentYear, currentMonth, selectedYear, hospitalId }) {
  if (currentYear === selectedYear) {
    return [
      <CurrentMonthEmployments key={currentMonth} month={currentMonth} year={selectedYear} hospitalId={hospitalId} />,
      Array(Number(currentMonth - 1))
        .fill(0)
        .map((_, index) => String(index + 1).padStart(2, "0"))
        .reverse()
        .map((month) => (
          <PassedMonthEmployments key={month} month={month} year={selectedYear} hospitalId={hospitalId} />
        )),
    ]
  }

  return Array(12)
    .fill(0)
    .map((_, index) => String(index + 1).padStart(2, "0"))
    .reverse()
    .map((month) => <PassedMonthEmployments key={month} month={month} year={selectedYear} hospitalId={hospitalId} />)
}

function formatMonthYear({ month, year }) {
  return NAME_MONTHS[month] + " " + year
}

function formatTitle({ currentMonth, currentYear, selectedYear }) {
  return selectedYear === currentYear ? NAME_MONTHS[currentMonth] + " " + selectedYear : `Année ${selectedYear}`
}

function describeRequest({ currentUser, selectedHospitalId }) {
  const hasManyHospitals = buildScope(currentUser)?.length > 1 || canAccessAllHospitals(currentUser)

  return hasManyHospitals
    ? selectedHospitalId
      ? "SUPERVISOR_HAS_SELECTED"
      : "SUPERVISOR_HAS_NOT_SELECTED"
    : selectedHospitalId
    ? "OPERATOR_HAS_EXPLICITLY_SELECTED"
    : "OPERATOR_HAS_IMPLICITLY_SELECTED"
}

function formatLastEdit({ edit, hospitalId }) {
  const { lastEdit, nbMonthsPreviousYear, previousYear } = edit

  return {
    hospitalId,
    lastAddedMonth: !lastEdit?.month
      ? null
      : formatMonthYear({
          month: lastEdit?.month,
          year: lastEdit?.year,
        }),
    lastUpdated: !lastEdit?.lastupdated ? null : isoToFr(lastEdit?.lastupdated),
    month: lastEdit?.month,
    nbMonthsPreviousYear,
    previousYear,
    year: lastEdit?.year,
  }
}

export const EmploymentsPage = ({ currentUser }) => {
  const router = useRouter()
  // the id hospital the user wants. The hid is an array for Next.js
  const { hid } = router.query

  const selectedHospitalId = Number(hid?.[0])

  switch (describeRequest({ currentUser, selectedHospitalId })) {
    case "SUPERVISOR_HAS_NOT_SELECTED":
      return <ListEmploymentsHospital currentUser={currentUser} />
    case "SUPERVISOR_HAS_SELECTED":
      if (canAccessAllHospitals(currentUser) || buildScope(currentUser).includes(selectedHospitalId)) {
        return <EmploymentsHospital currentUser={currentUser} hospitalId={selectedHospitalId} />
      }
      // TODO: gestion page d'erreur
      return "Vous n'êtes pas autorisé à voir cet hôpital"
    case "OPERATOR_HAS_IMPLICITLY_SELECTED":
      return <EmploymentsHospital currentUser={currentUser} hospitalId={currentUser.hospital?.id} />
    case "OPERATOR_HAS_EXPLICITLY_SELECTED":
      if (selectedHospitalId !== currentUser.hospital?.id) {
        return "Vous n'êtes pas autorisé à voir cet hôpital"
      }
      return <EmploymentsHospital currentUser={currentUser} hospitalId={selectedHospitalId} />
  }
}

function computeYearsOptions(currentYear) {
  return Array(currentYear - START_YEAR_MEDLE + 1)
    .fill(0)
    .map((_, index) => START_YEAR_MEDLE + index)
    .reverse()
    .map((current) => ({ label: current, value: current }))
}

/**
 * Composant lisant les établissements de son périmètre, pour voir les ETP
 */
const ListEmploymentsHospital = ({ currentUser }) => {
  const { year: currentYear } = extractMonthYear()
  const [selectedYear, setSelectedYear] = React.useState(currentYear)

  const [hospitals, setHospitals] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [lastEdits, setLastEdits] = React.useState([])

  useDebounce(handleSubmit, 500, [search])

  const filterHospitals = React.useCallback(
    (search) => {
      const hospitals = hospitalsOfUser(currentUser)
      // Filter by search if any
      return !search ? hospitals : hospitals.filter((hospital) => hospital?.name.match(new RegExp(search, "i")))
    },
    [currentUser],
  )

  // Darker color for Select
  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white", borderColor: "#555C64", color: "#555C64" }),
    placeholder: (styles) => ({ ...styles, color: "#555C64" }),
    indicatorSeparator: (styles) => ({ ...styles, backgroundColor: "#555C64" }),
    dropdownIndicator: (styles) => ({ ...styles, color: "#555C64" }),
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const allHospitalsOfUser = filterHospitals()
      setHospitals(allHospitalsOfUser)

      const promises = allHospitalsOfUser.map((hospital) => findLastEdit({ hospitalId: hospital?.id }))

      Promise.all(promises)
        .then((edits) => {
          // Promises and allHospitalsOfUser are in the same order, so it's safe to get id from allHospitalsOfUser.
          edits = edits.map((edit, index) => formatLastEdit({ edit, hospitalId: allHospitalsOfUser[index].id }))

          setLastEdits(castArrayInMap({ array: edits, propAsKey: "hospitalId" }))
        })
        .catch((error) => console.error("Erreur lors de la récupération des last edits", error))
    }
    fetchData()
  }, [filterHospitals])

  const yearsOptions = computeYearsOptions(currentYear)

  function handleSearchChange(event) {
    setSearch(event.target.value)
  }

  function handleSubmit(event) {
    event?.preventDefault()
    setHospitals(filterHospitals(search))
  }

  function handleYearChange(option) {
    setSelectedYear(option.value)
  }

  async function handleExport(event) {
    event.preventDefault()

    try {
      await exportEmployments({ hospitals: hospitals.map((hospital) => hospital.id), year: selectedYear })
    } catch (error) {
      console.error("Erreur trouvée", error)
    }
  }

  function getStatusHospital(hospital) {
    return !lastEdits[hospital.id]
      ? "UNKNOWN"
      : lastEdits[hospital.id].nbMonthsPreviousYear === 12
      ? "COMPLETED"
      : "UNCOMPLETED"
  }

  function buildLabelMissingMonths(hospital) {
    const nbMonths = lastEdits[hospital.id]?.nbMonthsPreviousYear
    return `${nbMonths} / 12 mois`
  }

  return (
    <Layout page="employments" currentUser={currentUser}>
      <Head>
        <title>Tous les établissements - Medlé</title>
      </Head>
      <Title1 className="mt-5 mb-4">{"Tous les établissements"}</Title1>
      <Container style={{ maxWidth: 980 }}>
        <Form onSubmit={handleSubmit}>
          <FormGroup inline className="mb-4 justify-content-center" role="group">
            <Row>
              <Col className="flex-grow-1">
                <InputDarker
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Rechercher un établissement"
                  autoComplete="off"
                  value={search}
                  onChange={handleSearchChange}
                  aria-label="Rechercher un établissement"
                  role="search"
                />
              </Col>
            </Row>
          </FormGroup>
        </Form>
        <div className="my-4 d-flex justify-content-center">
          <b>{hospitals?.length || 0}</b>&nbsp;résultat{hospitals?.length > 1 && "s"}
        </div>
        <Table responsive className="table-hover">
          <thead>
            <tr className="table-light">
              <th scope="col">Établissement</th>
              <th scope="col">Année {currentYear - 1}</th>
              <th scope="col">Dernier mois ajouté</th>
              <th scope="col">Ajouté le</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital) => (
              <Link key={hospital.id} href="/employments/[[...hid]]" as={`/employments/${hospital?.id}`}>
                <tr key={hospital.id} style={{ cursor: "pointer" }}>
                  <td>
                    <span>{hospital.name}</span>
                  </td>
                  <td>
                    {getStatusHospital(hospital) === "UNCOMPLETED" ? (
                      <div style={{ color: "#EE0700" }}>{buildLabelMissingMonths(hospital)}</div>
                    ) : (
                      getStatusHospital(hospital) === "COMPLETED" && "Complète"
                    )}
                  </td>
                  <td>{lastEdits[hospital.id]?.lastAddedMonth}</td>
                  <td>{lastEdits[hospital.id]?.lastUpdated}</td>
                  <td>
                    <Link href="/employments/[[...hid]]" as={`/employments/${hospital?.id}`}
                     className="text-decoration-none" aria-label={"Voir la déclaration de " + hospital.name}>
                        Voir<span aria-hidden="true">&nbsp;&gt;</span>
                    </Link>
                  </td>
                </tr>
              </Link>
            ))}
          </tbody>
        </Table>
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
          <span className="mb-3 mb-md-0">{"Export des ETP de la sélection pour l'année"}</span>
          <div className="mx-3 mb-3 mb-md-0" style={{ width: 100 }}>
            <Select
              options={yearsOptions}
              defaultValue={yearsOptions[0]}
              onChange={handleYearChange}
              styles={colourStyles}
              aria-label="Choix de l'année"
              ariaLiveMessages={ariaLiveMessagesFR}
              theme={reactSelectCustomTheme}
            />
          </div>
          <SearchButton className="btn-outline-primary" disabled={!hospitals?.length} onClick={handleExport}>
            <ListAltIcon /> Exporter
          </SearchButton>
        </div>
      </Container>
    </Layout>
  )
}

/**
 * Composant détaillant les ETP d'un établissement
 */
const EmploymentsHospital = ({ currentUser, hospitalId }) => {
  const { month: currentMonth, year: currentYear } = extractMonthYear()
  const [selectedYear, setSelectedYear] = React.useState(currentYear)

  const [employmentDataMonths, setEmploymentDataMonths] = React.useState()

  const [error, setError] = React.useState("")

  const title = formatTitle({ currentMonth, currentYear, selectedYear })

  React.useEffect(() => {
    const scopeUser = buildScope(currentUser)

    if (canAccessAllHospitals(currentUser) || scopeUser.includes(hospitalId)) {
      setEmploymentDataMonths(buildEmploymentDataMonth({ currentMonth, currentYear, hospitalId, selectedYear }))
    } else {
      setError("Vous n'êtes pas autorisé à voir les ETP de cet établissement.")
    }
  }, [currentUser, currentYear, currentMonth, selectedYear, hospitalId])

  const yearsOptions = computeYearsOptions(currentYear)

  function handleYearChange(option) {
    setSelectedYear(option.value)
  }

  const [hospital] = getReferenceData("hospitals").filter((hospital) => hospital.id === hospitalId)

  return (
    <Layout page="employments" currentUser={currentUser}>
      <Head>
        <title>Déclaration du personnel {hospital?.name && ` de ${hospital.name}`} - Medlé</title>
      </Head>
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
        <Title1 className="mt-5 mr-5 mb-4 mb-md-5">
          Déclaration du personnel {hospital?.name && ` de ${hospital.name}`}{" "}
        </Title1>
        <div className="mb-3 mb-md-0" style={{ width: 100 }}>
          <Select
            options={yearsOptions}
            defaultValue={yearsOptions[0]}
            onChange={handleYearChange}
            aria-label="Choix de l'année"
            ariaLiveMessages={ariaLiveMessagesFR}
            theme={reactSelectCustomTheme}
          />
        </div>
      </div>
      <Container style={{ maxWidth: 720 }}>
        {error ? (
          <Alert color="danger" className="mb-4">
            {error}
          </Alert>
        ) : (
          <>
            <Title2 className="mb-4 text-capitalize">{title}</Title2>
            <p className="mb-0 text-center font-italic">
              {"Veuillez indiquer le nombre d'ETP pour les différents profils de votre UMJ/IML."}
            </p>
            <p className="mb-5 text-center">
              <small>
                Attention, un ETP est un Équivalent Temps Plein et non un poste.{" "}
                <FooterDocument
                  color="#376FE6"
                  type={footerDocumentFAQ}
                  label={"+ d'informations dans la foire aux questions"}
                />
                .
              </small>
            </p>
            {employmentDataMonths}
          </>
        )}
      </Container>
    </Layout>
  )
}

EmploymentsPage.propTypes = {
  currentUser: PropTypes.object,
}

ListEmploymentsHospital.propTypes = { ...EmploymentsPage.propTypes, hospitalId: PropTypes.number }

EmploymentsHospital.propTypes = ListEmploymentsHospital.propTypes

export default withAuthentication(EmploymentsPage, EMPLOYMENT_CONSULTATION)
