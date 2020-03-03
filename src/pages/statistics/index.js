import React, { useState } from "react"
import { PropTypes } from "prop-types"
import { Pie, PieChart, Cell, Legend } from "recharts"
import HelpOutlineIcon from "@material-ui/icons/HelpOutline"
import { Button, ButtonGroup, Container, Form, FormGroup, Input } from "reactstrap"
import moment from "moment"

import { ISO_DATE, now } from "../../utils/date"

import { API_URL, GLOBAL_STATISTICS_ENDPOINT } from "../../config"
import { handleAPIResponse } from "../../utils/errors"
import { METHOD_POST } from "../../utils/http"
import { Label, Title1, Title2, ValidationButton } from "../../components/StyledComponents"
import { STATS_GLOBAL } from "../../utils/roles"
import { buildOptionsFetch, redirectIfUnauthorized, withAuthentication } from "../../utils/auth"
import { logError } from "../../utils/logger"
import Layout from "../../components/Layout"

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
   children: PropTypes.array,
}

const StatBlockNumbers = ({ title, firstNumber, firstLabel, secondNumber, secondLabel }) => {
   return (
      <StatBlock>
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
      </StatBlock>
   )
}

StatBlockNumbers.propTypes = {
   title: PropTypes.string,
   firstNumber: PropTypes.number,
   firstLabel: PropTypes.string,
   secondNumber: PropTypes.number,
   secondLabel: PropTypes.string,
}
const StatBlockPieChart = ({ data, hoverTitle, title }) => {
   return (
      <StatBlock>
         <div style={{ display: "inline-flex", verticalAlign: "middle", alignItems: "center" }} title={hoverTitle}>
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
               {title}
            </span>
            <HelpOutlineIcon fontSize="small" />
         </div>
         <PieChart width={280} height={210}>
            <Pie
               data={data}
               dataKey="value"
               cx="50%"
               cy="50%"
               outerRadius={80}
               innerRadius={20}
               labelLine={false}
               label={RenderCustomizedLabel}
            >
               {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
               ))}
            </Pie>
            <Legend wrapperStyle={{ color: "#9f9f9f" }} />
         </PieChart>
      </StatBlock>
   )
}

StatBlockPieChart.propTypes = {
   data: PropTypes.array,
   hoverTitle: PropTypes.string,
   title: PropTypes.string,
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

const StatisticsPage = ({ statistics: _statistics, currentUser }) => {
   const [statistics, setStatistics] = useState(_statistics)
   const [errors, setErrors] = useState({})
   const [state, setState] = useState({
      startDate: moment(now()).format("YYYY-MM-DD"),
      endDate: moment(now()).format("YYYY-MM-DD"),
   })

   const livingDeceaseddData = [
      {
         name: "Vivant",
         value: statistics.profilesDistribution.living || 0,
      },
      {
         name: "Thanato",
         value: statistics.profilesDistribution.deceased || 0,
      },
   ]

   const onChange = e => {
      setState({ ...state, [e.target.id]: e.target.value })
   }

   const onSubmit = async e => {
      e.preventDefault()

      const { startDate, endDate } = state
      const statistics = await fetchStatistics({ startDate, endDate })
      setState({
         ...state,
         startDate: statistics.inputs.startDate,
         endDate: statistics.inputs.endDate,
      })
      setStatistics(statistics)
   }

   return (
      <Layout page="statistics" currentUser={currentUser}>
         <Title1 className="mt-5 mb-3">{"Statistiques"}</Title1>
         <Container style={{ textAlign: "center" }}>
            <ButtonGroup className="pb-4">
               <Button color="primary">Global&nbsp;</Button>
               <Button outline color="primary">
                  &nbsp;Vivant
               </Button>
               <Button outline color="primary">
                  Thanato
               </Button>
            </ButtonGroup>

            <br />

            <Form inline className="pb-4 justify-content-center">
               <FormGroup>
                  <Label htmlFor="examinationDate" className="ml-2 mr-2">
                     {"Du"}
                  </Label>
                  <Input
                     id="startDate"
                     invalid={errors && !!errors.startDate}
                     type="date"
                     value={state.startDate}
                     // value={state.examinationDate}
                     onChange={onChange}
                     style={{ maxWidth: 150 }}
                  />
               </FormGroup>
               <FormGroup>
                  <Label htmlFor="examinationDate" className="ml-2 mr-2">
                     {"au"}
                  </Label>
                  <Input
                     id="endDate"
                     invalid={errors && !!errors.endDate}
                     type="date"
                     value={state.endDate}
                     // value={state.examinationDate}
                     onChange={onChange}
                     style={{ maxWidth: 150 }}
                  />
               </FormGroup>
               <ValidationButton color="primary" size="lg" className="center" onClick={onSubmit}>
                  Go
               </ValidationButton>
            </Form>

            <div
               style={{ width: "100%", maxWidth: 1050, display: "flex", flexWrap: "wrap", alignContent: "flex-start" }}
            >
               <StatBlockNumbers
                  title="Actes réalisés"
                  firstNumber={statistics.globalCount}
                  firstLabel="Actes au total (tous confondus)."
                  secondNumber={statistics.averageCount}
                  secondLabel="Actes par jour en moyenne."
               />
               <StatBlockPieChart
                  data={livingDeceaseddData}
                  hoverTitle="Hors assises et reconstitutions"
                  title="Répartition Vivant/Thanato"
               />
               <StatBlockNumbers
                  title="Actes hors examens"
                  firstNumber={statistics.profilesDistribution.reconstitution}
                  firstLabel="Reconstitutions."
                  secondNumber={statistics.profilesDistribution.criminalCourt}
                  secondLabel="Participations aux assises."
               />
               <StatBlockNumbers
                  title="Réquisitions"
                  firstNumber={statistics.actsWithSamePV}
                  firstLabel="Actes avec le même numéro de réquisition."
                  secondNumber={statistics.averageWithSamePV}
                  secondLabel="Actes par numéro en moyenne sur ces numéros récurrents."
               />
            </div>
         </Container>
      </Layout>
   )
}

const fetchStatistics = async ({ startDate, endDate, optionsFetch }) => {
   const response = await fetch(API_URL + GLOBAL_STATISTICS_ENDPOINT, {
      headers: { "Content-Type": "application/json" },
      method: METHOD_POST,
      body: JSON.stringify({ startDate, endDate, ...optionsFetch }),
   })

   return handleAPIResponse(response)
}

StatisticsPage.getInitialProps = async ctx => {
   const optionsFetch = buildOptionsFetch(ctx)

   try {
      const statistics = await fetchStatistics({ optionsFetch })
      return { statistics }
   } catch (error) {
      logError(error)
      redirectIfUnauthorized(error, ctx)
   }
}

StatisticsPage.propTypes = {
   statistics: PropTypes.object,
   currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(StatisticsPage, STATS_GLOBAL)
