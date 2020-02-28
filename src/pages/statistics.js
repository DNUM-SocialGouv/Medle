import React from "react"
import { PropTypes } from "prop-types"
import { Pie, PieChart, Cell, Legend } from "recharts"
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

StatBlock.propTypes = {
   children: PropTypes.object,
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
   const livingDeadData = [
      {
         name: "Vivant",
         value: stats.livingDeadOthers["Vivant"] || 0,
      },
      {
         name: "Thanato",
         value: stats.livingDeadOthers["Thanato"] || 0,
      },
   ]

   return (
      <Layout page="actDeclaration" currentUser={currentUser}>
         <Title1 className="mt-5 mb-5">{"Statistiques"}</Title1>
         <Container style={{ maxWidth: 1050 }}>
            {/* <div>{"on trouve" + JSON.stringify(stats)}</div> */}
            <StatBlock>
               <Title2 className="mb-4">Actes réalisés</Title2>
               <p style={{ color: "#2E384D", fontSize: 35, fontFamily: "Evolventa" }}>{stats.globalCount}</p>

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
                  Actes au total (tous confondus).
               </p>
               <p style={{ color: "#2E384D", fontSize: 35, fontFamily: "Evolventa" }}>{stats.averageCount}</p>
               <p
                  style={{
                     color: "#4a4a4a",
                     marginTop: -25,
                     marginLeft: 2,
                     fontSize: 15,
                     fontFamily: "Source Sans Pro",
                  }}
               >
                  Actes par jour en moyenne.
               </p>
            </StatBlock>
            <StatBlock>
               <Title2>Répartition Vivant/Thanato</Title2>
               <PieChart width={280} height={200}>
                  <Pie
                     data={livingDeadData}
                     cx="50%"
                     cy="50%"
                     outerRadius={80}
                     labelLine={false}
                     label={RenderCustomizedLabel}
                  >
                     {livingDeadData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                     ))}
                  </Pie>
                  <Legend wrapperStyle={{ color: "#9f9f9f" }} />
               </PieChart>
            </StatBlock>
            <StatBlock>Card 3</StatBlock>
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
