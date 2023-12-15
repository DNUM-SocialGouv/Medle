import ListAltIcon from "@material-ui/icons/ListAlt"
import Head from "next/head"
import { useRouter } from "next/router"
import { PropTypes } from "prop-types"
import React, { useState } from "react"
import { Alert, Container, Table } from "reactstrap"

import { searchHospitalsFuzzy } from "../../clients/hospitals"
import Layout from "../../components/Layout"
import { Button, Title1 } from "../../components/StyledComponents"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../utils/auth"
import { logError } from "../../utils/logger"
import { ACTIVITY_CONSULTATION } from "../../utils/roles"
import { findSummaryByHospital } from "../../clients/acts-summary"
import { findEmploymentsByHospitalId } from "../../clients/employments"


const monthsOfYear = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
]
const dataRessources = [
  ["Médecin 1", 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
  ["Médecin 2", 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
  ["Médecin 3", '', '', '', '', '', 20, 20, 20, 20, 20, 20, 20],
  ["Capacité à fournir", 40, 40, 40, 40, 40, 60, 60, 60, 60, 60, 60, 60],
]


const calcTotal = ["Adéquation de la charge et de la capacité de travail (en jours)", 13, 4, -2, 0, 1, 3, 2, 8, 5, 8, 5, -3]

function extractYearsFromArray(array) {
  const yearsSet = new Set();
  array.forEach(item => {
    const summary = item.summary;
    if (summary) {
      const itemYears = Object.keys(summary);
      itemYears.forEach(year => {
        yearsSet.add(year);
      });
    }
  });

  const uniqueYears = Array.from(yearsSet);
  return uniqueYears;
}

const SummaryPage = ({ hospitalSummary, currentUser, medicalSummary }) => {
  const router = useRouter()
  const { hid } = router.query


  // const [hospitals, setHospitals] = useState(initialHospitals)
  const [error, setError] = useState("")
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));

  const handleChange = (event) => {
    setSelectedYear(event.target.value);
  };


  const years = extractYearsFromArray(hospitalSummary)

  const cellsStyle = { minWidth: "90px", textAlign: "center" }
  return (
    <Layout page="synthese-activite" currentUser={currentUser} admin={false}>
      <Head>
        <title>Synthèse de l&apos;activité - Medlé</title>
      </Head>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1>{"Synthèse de l'établissement CHU Marseille"}</Title1>
        <select defaultValue={selectedYear} value={selectedYear} onChange={handleChange}>
          {years.map((year, index) => (
            <option key={index} value={year}>{year}</option>
          ))}
        </select>
      </Container>

      <Container style={{ maxWidth: 1300, minWidth: 740 }}>
        {error && (
          <Alert color="danger" className="mb-4">
            {error}
          </Alert>
        )}
        {!hospitalSummary.length && <div className="text-center">{"Aucune synthèse trouvé."}</div>}

        {!!hospitalSummary.length && (
          <>
            <Table responsive className="table-hover">
              <thead>
                <tr className="table-light">
                  <th scope="col" style={cellsStyle}>
                    {"Personnel médical (en jours travaillés)"}
                  </th>
                  {monthsOfYear.map((month, index) => (
                    <th key={index} style={cellsStyle} scope="col">
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <td style={cellsStyle}>
                  Capacité à fournir
                </td>
                {monthsOfYear.map((month, index) => (
                  <td key={index} style={cellsStyle}>

                    {medicalSummary[selectedYear][month.charAt(0).toLowerCase() + month.slice(1)]}
                  </td>
                ))}

              </tbody>
            </Table>

            <Table responsive className="table-hover">
              <thead>
                <tr className="table-light">
                  <th style={cellsStyle} scope="col">
                    {"Actes réalisés (en jours)"}
                  </th>
                  {monthsOfYear.map((month, index) => (
                    <th key={index} style={cellsStyle} scope="col">
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hospitalSummary.map((activity, index) => (
                  <tr key={index} className={activity[0] === "Activité" ? "table-info" : ""}>
                    <td style={cellsStyle}>
                      {activity.category}
                    </td>
                    {monthsOfYear.map((month, index) => (
                      <td key={index} style={cellsStyle}>
                        {activity.summary[selectedYear][month.charAt(0).toLowerCase() + month.slice(1)]?.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
            <Table responsive className="table-hover">
              <thead>
                <tr className="table-light">
                  <th scope="col" style={cellsStyle} />
                  {monthsOfYear.map((month, index) => (
                    <th key={index} style={cellsStyle} scope="col">
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {calcTotal.map((charge, index) => (
                    <td
                      style={cellsStyle}
                      key={index}
                      className={typeof charge !== "string" ? (charge > 0 ? "text-success" : "text-danger") : ""}
                    >
                      <p className="fw-bold">{charge}</p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </Table>
          </>
        )}

        <div className="mt-5 d-flex justify-content-center">
          <Button className="btn-outline-primary mr-3">
            <ListAltIcon /> Exporter les données
          </Button>
          <Button onClick={() => router.push(`/synthese-activite/graph/${hid}`)} className="btn-outline-primary">
            <ListAltIcon /> Graph de synthèse
          </Button>
        </div>
      </Container>
    </Layout>
  )
}

SummaryPage.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)
  const { hid: hospitalId } = ctx.query

  try {
    const hospitalSummary = await findSummaryByHospital({ hospitalId, headers })

    const medicalSummary = await findEmploymentsByHospitalId({ hospitalId, headers })
    console.log(medicalSummary, hospitalSummary);
    return { hospitalSummary, medicalSummary }
  } catch (error) {
    logError(error)
    redirectIfUnauthorized(error, ctx)

    const message = error.status && error.status === 404 ? "La synthèse n'a pu être trouvé." : "Erreur serveur."

    return { error: message }
  }
}

SummaryPage.propTypes = {
  hospitalSummary: PropTypes.array,
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(SummaryPage, ACTIVITY_CONSULTATION)
