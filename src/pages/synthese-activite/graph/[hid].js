import ListAltIcon from "@material-ui/icons/ListAlt"
import Head from "next/head"
import { useRouter } from "next/router"
import { PropTypes } from "prop-types"
import React, { useState } from "react"
import { Alert, Container } from "reactstrap"
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, Tooltip, XAxis, YAxis } from "recharts"

import { findHospital, searchHospitalsFuzzy } from "../../../clients/hospitals"
import Layout from "../../../components/Layout"
import { Button, Title1 } from "../../../components/StyledComponents"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../utils/auth"
import { logError } from "../../../utils/logger"
import { ACTIVITY_CONSULTATION } from "../../../utils/roles"
import { findSummaryByHospital } from "../../../clients/acts-summary"
import { findEmploymentsByHospitalId } from "../../../clients/employments"

const data = [
  {
    name: "Janvier",
    "Capacité à fournir": 63,
    Activité: 50,
  },
  {
    name: "Février",
    "Capacité à fournir": 60,
    Activité: 56,
  },
  {
    name: "Mars",
    "Capacité à fournir": 60,
    Activité: 57,
  },
  {
    name: "Avril",
    "Capacité à fournir": 63,
    Activité: 63,
  },
  {
    name: "Mai",
    "Capacité à fournir": 62,
    Activité: 61,
  },
  {
    name: "Juin",
    "Capacité à fournir": 62,
    Activité: 59,
  },
  {
    name: "Juillet",
    "Capacité à fournir": 62,
    Activité: 64,
  },
  {
    name: "Aout",
    "Capacité à fournir": 56,
    Activité: 64,
  },
  {
    name: "Septembre",
    "Capacité à fournir": 57,
    Activité: 62,
  },
  {
    name: "Octobre",
    "Capacité à fournir": 56,
  },
  {
    name: "Novembre",
    "Capacité à fournir": 59,
    Activité: 64,
  },
  {
    name: "Décembre",
    "Capacité à fournir": 55,
    Activité: 60,
  },
]

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

const SummaryGraphPage = ({ currentUser, formattedGraphData, hospital }) => {
  const [error] = useState("")
  const router = useRouter()
  const years = Object.keys(formattedGraphData)
  const [selectedYear, setSelectedYear] = useState(String(years[years.length - 1]));
  const { hid } = router.query
  
  const handleChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <Layout page="synthese-activite" currentUser={currentUser} admin={false}>
      <Head>
        <title>Graphique de synthèse de l&apos;activité - Medlé</title>
      </Head>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1 className="">{`Graphique de synthèse de l'établissement ${hospital.name}`}</Title1>
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
        {/* {!error && !hospitals.length && <div className="text-center">{"Aucun établissement trouvé."}</div>} */}

        <Container className="d-flex justify-content-center" style={{ maxWidth: 1300, minWidth: 740 }}>
          <BarChart
            width={1100}
            height={500}
            data={formattedGraphData[selectedYear]}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Capacité à fournir" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            <Bar dataKey="Activité" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
          </BarChart>
        </Container>
        <div className="mt-5 d-flex justify-content-center">
          <Button onClick={() => router.push(`/synthese-activite/${hid}`)} className="btn-outline-primary">
            <ListAltIcon /> Synthèse de l&apos;activité
          </Button>
        </div>
      </Container>
    </Layout>
  )
}

SummaryGraphPage.getInitialProps = async (ctx) => {
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

    function getFormattedData(medicalSummary, hospitalSummary) {
      const result = {};

      for (const year in medicalSummary) {
        const valuesByYear = monthsOfYear
          .map((month) => month.charAt(0).toLowerCase() + month.slice(1))
          .map((month) => {
            const medicalSummaryByMonth = parseFloat(medicalSummary[year][month]) || 0;
            const hospitalSummaryBymonth = calculateSummaryValue(hospitalSummary, year, month);
            return {name: month,  "Capacité à fournir": Math.round(medicalSummaryByMonth), "Activité": hospitalSummaryBymonth}
          });
          result[year] = valuesByYear
      }
      return result;
    }

    const formattedGraphData = getFormattedData(medicalSummary, hospitalSummary)

    return { formattedGraphData, hospital }
  } catch (error) {
    logError("APP error", error)

    redirectIfUnauthorized(error, ctx)
  }
  return {}
}

SummaryGraphPage.propTypes = {
  hospitals: PropTypes.array,
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(SummaryGraphPage, ACTIVITY_CONSULTATION)
