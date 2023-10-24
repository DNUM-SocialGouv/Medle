import ListAltIcon from "@material-ui/icons/ListAlt"
import Head from "next/head"
import { useRouter } from "next/router"
import { PropTypes } from "prop-types"
import React, { useState } from "react"
import { Alert, Container } from "reactstrap"
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, Tooltip, XAxis, YAxis } from "recharts"

import { searchHospitalsFuzzy } from "../../../clients/hospitals"
import Layout from "../../../components/Layout"
import { Button, Title1 } from "../../../components/StyledComponents"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../utils/auth"
import { logError } from "../../../utils/logger"
import { ACTIVITY_CONSULTATION } from "../../../utils/roles"

const data = [
  {
    name: "Janvier",
    "Capacité à fournir": 63,
    Activité: 50,
    amt: 2400,
  },
  {
    name: "Février",
    "Capacité à fournir": 60,
    Activité: 56,
    amt: 2210,
  },
  {
    name: "Mars",
    "Capacité à fournir": 60,
    Activité: 57,
    amt: 2290,
  },
  {
    name: "Avril",
    "Capacité à fournir": 63,
    Activité: 63,
    amt: 2000,
  },
  {
    name: "Mai",
    "Capacité à fournir": 62,
    Activité: 61,
    amt: 2181,
  },
  {
    name: "Juin",
    "Capacité à fournir": 62,
    Activité: 59,
    amt: 2500,
  },
  {
    name: "Juillet",
    "Capacité à fournir": 62,
    Activité: 64,
    amt: 2100,
  },
  {
    name: "Aout",
    "Capacité à fournir": 56,
    Activité: 64,
    amt: 2400,
  },
  {
    name: "Septembre",
    "Capacité à fournir": 57,
    Activité: 62,
    amt: 2210,
  },
  {
    name: "Octobre",
    "Capacité à fournir": 56,
    Activité: 64,
    amt: 2290,
  },
  {
    name: "Novembre",
    "Capacité à fournir": 59,
    Activité: 64,
    amt: 2000,
  },
  {
    name: "Décembre",
    "Capacité à fournir": 55,
    Activité: 60,
    amt: 2181,
  },
]

const SummaryPage = ({ hospitals: initialHospitals, currentUser }) => {
  const [hospitals, setHospitals] = useState(initialHospitals)
  const [error, setError] = useState("")
  const router = useRouter()
  const { hid } = router.query

  return (
    <Layout page="hospitals" currentUser={currentUser} admin={false}>
      <Head>
        <title>Graph de synthèse de l&apos;activité - Medlé</title>
      </Head>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1 className="">{"Graph de synthèse de l'établissement CHU Marseille"}</Title1>
      </Container>

      <Container style={{ maxWidth: 1300, minWidth: 740 }}>
        {error && (
          <Alert color="danger" className="mb-4">
            {error}
          </Alert>
        )}
        {!error && !hospitals.length && <div className="text-center">{"Aucun établissement trouvé."}</div>}

        <Container className="d-flex justify-content-center" style={{ maxWidth: 1300, minWidth: 740 }}>
          <BarChart
            width={1100}
            height={500}
            data={data}
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
