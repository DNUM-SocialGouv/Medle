import ListAltIcon from "@material-ui/icons/ListAlt"
import Head from "next/head"
import { useRouter } from "next/router"
import { PropTypes } from "prop-types"
import React, { useState } from "react"
import { Alert, Container, Table } from "reactstrap"

import Layout from "../../components/Layout"
import { Button, Title1 } from "../../components/StyledComponents"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../utils/auth"
import { logError } from "../../utils/logger"
import { ACTIVITY_CONSULTATION } from "../../utils/roles"
import { findSummaryByHospital } from "../../clients/acts-summary"
import { findEmploymentsByHospitalId } from "../../clients/employments"
import { findHospital } from "../../clients/hospitals"
import { isOpenFeature } from "../../config"
import { fetchExport } from "../../clients/acts-summary"

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

const SummaryPage = ({ hospitalSummary = [], currentUser, medicalSummary, differences, hospital, totalSummaryAct, headers }) => {
  const router = useRouter()
  const { hid } = router.query
  const years = Object.keys(medicalSummary)

  const [error] = useState("")
  const [selectedYear, setSelectedYear] = useState(String(years[years.length - 1]));
  const handleChange = (event) => {
    setSelectedYear(event.target.value);
  };

  async function onExport() {
    await fetchExport(selectedYear, hid, headers)
  }

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
        <Title1>{`Synthèse de l'établissement ${hospital.name}`}</Title1>
        <span>Dernière date de mise à jour : {new Date().toLocaleDateString()}</span>
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
                  <th scope="col" style={cellsStyle} />
                  {monthsOfYear.map((month, index) => (
                    <th key={index} style={cellsStyle} scope="col">
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <td style={cellsStyle}>
                  Adéquation de la charge et de la capacité de travail (en jours)
                </td>
                {monthsOfYear.map((month, index) => {
                  const charge = differences[selectedYear][month.charAt(0).toLowerCase() + month.slice(1)];
                  return <td key={index} style={cellsStyle} className={typeof charge !== "string" ? (charge > 0 ? "text-success" : "text-danger") : ""}>
                    {differences[selectedYear] ? charge : ""}
                  </td>
                })}
              </tbody>
            </Table>

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
                {monthsOfYear.map((month, index) => {
                  const etp = medicalSummary[selectedYear][month.charAt(0).toLowerCase() + month.slice(1)] || 0;
                  return <td key={index} style={cellsStyle}>
                    {medicalSummary[selectedYear] ?
                      Math.round(etp) : ""}
                  </td>
                })}
              </tbody>
            </Table>

            <Table responsive className="table-hover" style={{ maxHeight: '600px' }}>
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
                <tr>
                  <td style={cellsStyle}>
                    Charge totale de travail
                  </td>
                  {monthsOfYear.map((month, index) => (
                    <td key={index} style={cellsStyle}>
                      {totalSummaryAct && totalSummaryAct[selectedYear] ? totalSummaryAct[selectedYear][month.charAt(0).toLowerCase() + month.slice(1)] || 0 : 0}
                    </td>
                  ))}
                </tr>
                {hospitalSummary.map((activity, index) => (
                  activity.summary[selectedYear] &&
                  <tr key={index} className={activity[0] === "Activité" ? "table-info" : ""}>
                    <td style={cellsStyle}>
                      {activity.category}
                    </td>
                    {monthsOfYear.map((month, index) => (
                      <td key={index} style={cellsStyle}>
                        {activity.summary[selectedYear] ? activity.summary[selectedYear][month.charAt(0).toLowerCase() + month.slice(1)] || 0 : 0}
                      </td>
                    ))}
                  </tr>
                ))}

              </tbody>
            </Table>
          </>
        )}

        <div className="mt-5 d-flex justify-content-center">
        {isOpenFeature("export") && (
              <>
                  <Button className="btn-outline-primary mr-3" onClick={onExport}>
                    <ListAltIcon /> Exporter les données
                  </Button>
              </>
            )}
          <Button onClick={() => router.push(`/synthese-activite/graph/${hid}`)} className="btn-outline-primary">
            <ListAltIcon /> Graphique de synthèse
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
    const {elements: hospitalSummary, hospital} = await findSummaryByHospital({ hospitalId, headers })
    const medicalSummary = await findEmploymentsByHospitalId({ hospitalId, headers })

    function calculateSummaryValue(hospitalSummary, year, month) {
      let sum = 0;

      for (const obj of hospitalSummary) {
        if (obj.summary && obj.summary[year] && obj.summary[year][month] !== undefined) {
          sum += parseFloat(obj.summary[year][month]) || 0;
        }
      }

      return sum;
    }

    function calculateDifferencesByYearOrdered(medicalSummary, hospitalSummary) {
      const result = {};
      const totalSummaryAct = {};

      for (const year in medicalSummary) {
        const differencesByMonth = monthsOfYear.map((month) => month.charAt(0).toLowerCase() + month.slice(1)).map((month) => {
          const medicalSummaryByMonth = parseFloat(medicalSummary[year][month]) || 0;
          const hospitalSummaryBymonth = calculateSummaryValue(hospitalSummary, year, month);

          if (!totalSummaryAct[year]) {
            totalSummaryAct[year] = {};
          }
          totalSummaryAct[year][month] = hospitalSummaryBymonth;

          const difference = medicalSummaryByMonth - hospitalSummaryBymonth;
          return { month, difference };
        });

        result[year] = differencesByMonth.reduce((acc, curr) => {
          acc[curr.month] = Math.round(curr.difference);
          return acc;
        }, {});
      }

      return { result, totalSummaryAct };
    }

    const { result: differences, totalSummaryAct } = calculateDifferencesByYearOrdered(medicalSummary, hospitalSummary);
    return { hospitalSummary, medicalSummary, differences, totalSummaryAct, hospital, headers }
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
