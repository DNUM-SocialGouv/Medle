import React from "react"
import { PropTypes } from "prop-types"
import { Pie, PieChart, Cell, Legend } from "recharts"
import HelpOutlineIcon from "@material-ui/icons/HelpOutline"
import Tooltip from "@material-ui/core/Tooltip"

import { API_URL, GLOBAL_STATISTICS_ENDPOINT } from "../config"
import { handleAPIResponse } from "../utils/errors"
import { buildOptionsFetch, redirectIfUnauthorized, withAuthentication } from "../utils/auth"
import { logError, logDebug } from "../utils/logger"
import Layout from "../components/Layout"
import { Container } from "reactstrap"
import { Title1, Title2 } from "../components/StyledComponents"

import { STATS_GLOBAL } from "../utils/roles"

const StatBlock = ({ children }) => {
   return (
      <div
         style={{
            width: "300px",
            height: "260px",
            border: "1px solid rgba(46,91,255,0.08)",
            display: "inline-block",
            color: "#BBB",
            borderRadius: 1,
            padding: "10px 10px 10px 20px",
            margin: "10px 20px",
            boxShadow: "0 10px 20px 0 rgba(46,91,255,0.07)",
         }}
      >
         {children}
      </div>
   )
}
const StatBlockNumbers = ({ title, firstNumber, firstLabel, secondNumber, secondLabel }) => {
   return (
      <div
         style={{
            width: "300px",
            height: "260px",
            border: "1px solid rgba(46,91,255,0.08)",
            display: "inline-block",
            color: "#BBB",
            borderRadius: 1,
            padding: "10px 10px 10px 20px",
            margin: "10px 20px",
            boxShadow: "0 10px 20px 0 rgba(46,91,255,0.07)",
         }}
      >
         <Title2 className="mb-4">{title}</Title2>
         <p style={{ color: "#2E384D", fontSize: 35, fontFamily: "Evolventa" }}>{firstNumber}</p>

         <p
            style={{
               color: "#4a4a4a",
               marginTop: -25,
               marginLeft: 2,
               fontSize: 15,
               fontFamily: "Source Sans Pro",
            }}
            className="mb-4"
         >
            {firstLabel}
         </p>
         <p style={{ color: "#2E384D", fontSize: 35, fontFamily: "Evolventa" }}>{secondNumber}</p>
         <p
            style={{
               color: "#4a4a4a",
               marginTop: -25,
               marginLeft: 2,
               fontSize: 15,
               fontFamily: "Source Sans Pro",
            }}
         >
            {secondLabel}
         </p>
      </div>
   )
}

StatBlockNumbers.propTypes = {
   title: PropTypes.string,
   firstNumber: PropTypes.number,
   firstLabel: PropTypes.string,
   secondNumber: PropTypes.number,
   secondLabel: PropTypes.string,
}

const colors = ["#307df6", "#ed6b67", "#eaa844", "#7ce0c3", "#ad33d8"]

const RADIAN = Math.PI / 180

const RenderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
   const radius = innerRadius + (outerRadius - innerRadius) * 0.5
   const x = cx + radius * Math.cos(-midAngle * RADIAN)
   const y = cy + radius * Math.sin(-midAngle * RADIAN)

   return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
         {`${(percent * 100).toFixed(0)}%`}
      </text>
   )
}

RenderCustomizedLabel.propTypes = {
   cx: PropTypes.any,
   cy: PropTypes.any,
   midAngle: PropTypes.any,
   innerRadius: PropTypes.any,
   outerRadius: PropTypes.any,
   percent: PropTypes.any,
}

const StatisticsPage = ({ stats, currentUser }) => {
   const livingDeceaseddData = [
      {
         name: "Vivant",
         value: stats.profilesDistribution.living || 0,
      },
      {
         name: "Thanato",
         value: stats.profilesDistribution.deceased || 0,
      },
   ]

   return (
      <Layout page="statistics" currentUser={currentUser}>
         <Title1 className="mt-5 mb-5">{"Statistiques"}</Title1>
         <Container
            style={{ width: "100%", maxWidth: 1050, display: "flex", flexWrap: "wrap", alignContent: "flex-start" }}
         >
            {/* <div>{"on trouve" + JSON.stringify(stats)}</div> */}
            <StatBlockNumbers
               title="Actes réalisés"
               firstNumber={stats.globalCount}
               firstLabel="Actes au total (tous confondus)."
               secondNumber={stats.averageCount}
               secondLabel="Actes par jour en moyenne."
            />
            <StatBlock>
               <div
                  style={{ display: "inline-flex", verticalAlign: "middle", alignItems: "center" }}
                  title="Hors assises et reconstitutions"
               >
                  <span
                     style={{
                        height: 24,
                        color: "#212529",
                        fontFamily: "Evolventa",
                        fontSize: 18,
                        textAlign: "center",
                        fontWeight: 400,
                     }}
                  >
                     Répartition Vivant/Thanato{"  "}
                  </span>
                  <HelpOutlineIcon fontSize="small" />
               </div>
               <PieChart width={280} height={210}>
                  <Pie
                     data={livingDeceaseddData}
                     dataKey="value"
                     cx="50%"
                     cy="50%"
                     outerRadius={80}
                     innerRadius={20}
                     labelLine={false}
                     label={RenderCustomizedLabel}
                  >
                     {livingDeceaseddData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                     ))}
                  </Pie>
                  <Legend wrapperStyle={{ color: "#9f9f9f" }} />
               </PieChart>
            </StatBlock>
            <StatBlockNumbers
               title="Actes hors examens"
               firstNumber={stats.profilesDistribution.reconstitution}
               firstLabel="Reconstitutions."
               secondNumber={stats.profilesDistribution.criminalCourt}
               secondLabel="Participations aux assises."
            />
            <StatBlockNumbers
               title="Réquisitions"
               firstNumber={stats.actsWithSamePV}
               firstLabel="Actes avec le même numéro de réquisition."
               secondNumber={stats.averageWithSamePV}
               secondLabel="Actes par numéro en moyenne sur ces numéros récurrents."
            />
         </Container>
      </Layout>
   )
}

StatisticsPage.getInitialProps = async ctx => {
   const optionsFetch = buildOptionsFetch(ctx)

   try {
      const response = await fetch(API_URL + GLOBAL_STATISTICS_ENDPOINT, optionsFetch)
      const stats = await handleAPIResponse(response)
      return { stats }
   } catch (error) {
      logError(error)

      redirectIfUnauthorized(error, ctx)
   }
}

StatisticsPage.propTypes = {
   stats: PropTypes.object,
   currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(StatisticsPage, STATS_GLOBAL)
