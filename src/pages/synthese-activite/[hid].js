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


const monthsOfYear = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
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

const Actes = [
  ["Actes type 1", 15, 17, 18, 20, 21, 19, 22, 16, 18, 17, 16, 15],
  ["Actes type 2", 19, 21, 20, 22, 23, 20, 18, 19, 21, 20, 23, 22],
  ["Actes type 3", 16, 18, 19, 21, 17, 20, 22, 21, 18, 19, 20, 18],
  ["Total du temps médical nécessaire", 50, 56, 57, 63, 61, 59, 62, 56, 57, 56, 59, 55],
]

const calcTotal = ["Adéquation de la charge et de la capacité de travail (en jours)", 13, 4, -2, 0, 1, 3, 2, 8, 5, 8, 5, -3]

const SummaryPage = ({ hospitals: initialHospitals, currentUser }) => {
  const [hospitals, setHospitals] = useState(initialHospitals)
  const [error, setError] = useState("")
  const router = useRouter()
  const { hid } = router.query

  const cellsStyle = { minWidth: "90px", textAlign: "center" }
  return (
    <Layout page="hospitals" currentUser={currentUser} admin={false}>
      <Head>
        <title>Synthèse de l&apos;activité - Medlé</title>
      </Head>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1 className="">{"Synthèse de l'établissement CHU Marseille"}</Title1>
        <span>Date de dernière mise à jour : 23/10/2023</span>
      </Container>

      <Container style={{ maxWidth: 1300, minWidth: 740 }}>
        {error && (
          <Alert color="danger" className="mb-4">
            {error}
          </Alert>
        )}
        {!error && !hospitals.length && <div className="text-center">{"Aucun établissement trouvé."}</div>}

        {!error && !!hospitals.length && (
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
                {dataRessources.map((charge, i) => (
                  <tr key={i} className={charge[0] === "Capacité à fournir" ? "table-info" : ""}>
                    {charge.map((c, index) => (
                      <td key={index} style={cellsStyle}>
                        {c}
                      </td>
                    ))}
                  </tr>
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
                {Actes.map((charge, index) => (
                  <tr key={index} className={charge[0] === "Activité" ? "table-info" : ""}>
                    {charge.map((c, i) => (
                      <td key={i} style={cellsStyle}>
                        {c}
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

  try {
    const hospitals = await searchHospitalsFuzzy({ headers })
    return { hospitals }
  } catch (error) {
    logError("APP error", error)

    redirectIfUnauthorized(error, ctx)
  }
  return {}
}

SummaryPage.propTypes = {
  hospitals: PropTypes.array,
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(SummaryPage, ACTIVITY_CONSULTATION)
