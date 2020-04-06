import React, { useState, useEffect } from "react"
import { PropTypes } from "prop-types"

import { Alert, Col, Container, Form, FormGroup, Input, Row } from "reactstrap"
import fetch from "isomorphic-unfetch"
import moize from "moize"
import Switch from "react-switch"

import {
   API_URL,
   GLOBAL_STATISTICS_ENDPOINT,
   LIVING_STATISTICS_ENDPOINT,
   DEACEASED_STATISTICS_ENDPOINT,
} from "../../config"
import { handleAPIResponse } from "../../utils/errors"
import { METHOD_POST } from "../../utils/http"
import Layout from "../../components/Layout"
import TabButton from "../../components/TabButton"
import { Label, Title1 } from "../../components/StyledComponents"
import { STATS_GLOBAL } from "../../utils/roles"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../utils/auth"
import { logError, logDebug } from "../../utils/logger"
import { isEmpty, pluralize } from "../../utils/misc"

import { StatBlockNumbers, StatBlockPieChart } from "../../components/StatBlock"
import { isValidStartDate, isValidEndDate } from "../../services/statistics/common"
import { buildScope } from "../../services/scope"
import { now, ISO_DATE } from "../../utils/date"

// handy skeleton structure to avoid future "undefined" management
const statisticsDefault = {
   inputs: {},
   globalCount: 0,
   averageCount: 0,
   profilesDistribution: {}, // nested object can't be merged in JS so empty object is enough
   actsWithSamePV: 0,
   averageWithSamePV: 0,
   actsWithPv: {},
   actTypes: {},
   hours: {},
   examinations: {},
}

const defaultStartDate = now()
   .startOf("year")
   .format(ISO_DATE)

const fetchStatistics = async ({
   type = "Global",
   scopeFilter = [],
   startDate = defaultStartDate,
   endDate = now(),
   authHeaders,
}) => {
   const obj = {
      Vivant: LIVING_STATISTICS_ENDPOINT,
      Thanato: DEACEASED_STATISTICS_ENDPOINT,
   }

   const endpoint = obj[type] || GLOBAL_STATISTICS_ENDPOINT

   const response = await fetch(API_URL + endpoint, {
      method: METHOD_POST,
      body: JSON.stringify({ startDate, endDate, scopeFilter }),
      headers: { "Content-Type": "application/json", ...authHeaders },
   })

   const statistics = await handleAPIResponse(response)
   return { ...statisticsDefault, ...statistics }
}

const MAX_AGE = 1000 * 60 * 5 // five minutes;

const memoizedFetchStatistics = moize({ maxAge: MAX_AGE, isDeepEqual: true })(fetchStatistics)

const livingDeceaseddData = statistics => [
   {
      name: "Vivant",
      value: statistics.profilesDistribution["Vivant"] || 0,
   },
   {
      name: "Thanato",
      value: statistics.profilesDistribution["Personne décédée"] || 0,
   },
]

const actsWithPvData = statistics => [
   {
      name: "Avec",
      value: statistics.actsWithPv["Avec réquisition"] || 0,
   },
   {
      name: "Sans (non renseigné)",
      value: statistics.actsWithPv["Sans réquisition"] || 0,
   },
   {
      name: "Recueil de preuves sans plainte",
      value: statistics.actsWithPv["Recueil de preuve sans plainte"] || 0,
   },
]

const actTypesData = statistics => [
   {
      name: "Somatique",
      value: statistics.actTypes["Somatique"] || 0,
   },
   {
      name: "Psychiatrique",
      value: statistics.actTypes["Psychiatrique"] || 0,
   },
]

const hoursData = statistics => [
   {
      name: "Journée",
      value: statistics.hours["Journée"] || 0,
   },
   {
      name: "Soirée",
      value: statistics.hours["Soirée"] || 0,
   },
   {
      name: "Nuit profonde",
      value: statistics.hours["Nuit profonde"] || 0,
   },
]

const examinationsData = statistics => [
   {
      name: "Biologie",
      value: statistics.examinations["Biologie"] || 0,
   },
   {
      name: "Imagerie",
      value: statistics.examinations["Imagerie"] || 0,
   },
   {
      name: "Toxicologie",
      value: statistics.examinations["Toxicologie"] || 0,
   },
   {
      name: "Anapath",
      value: statistics.examinations["Anapath"] || 0,
   },
   {
      name: "Génétique",
      value: statistics.examinations["Génétique"] || 0,
   },
   {
      name: "Autres",
      value: statistics.examinations["Autres"] || 0,
   },
]

const StatisticsPage = ({ statistics: _statistics, currentUser }) => {
   const [statistics, setStatistics] = useState(_statistics)
   const [scopeFilter, setScopeFilter] = useState({ isNational: true, scope: [] })
   const [type, setType] = useState("Global")
   const [formState, setFormState] = useState({
      startDate: statistics.inputs.startDate,
      endDate: statistics.inputs.endDate,
   })
   const [errors, setErrors] = useState({})

   useEffect(() => {
      logDebug("Remove statistics cache")
      memoizedFetchStatistics.clear()
   }, [])

   useEffect(() => {
      logDebug("Update UI after state changes")
      const syncUI = async () => {
         const statistics = await memoizedFetchStatistics({
            type,
            startDate: formState.startDate,
            endDate: formState.endDate,
            scopeFilter: scopeFilter.scope,
         })
         setStatistics(statistics)
      }
      syncUI()
   }, [formState.endDate, formState.startDate, scopeFilter.scope, type])

   const onChange = e => {
      setErrors({})
      if (e.target.id === "startDate") {
         if (!isValidStartDate(e.target.value, formState.endDate))
            setErrors({ startDate: "La date de début doit être avant la date de fin." })
      }
      if (e.target.id === "endDate") {
         if (!isValidEndDate(e.target.value))
            setErrors({
               endDate: "La date de fin ne doit pas être future.",
            })
      }
      setFormState({ ...formState, [e.target.id]: e.target.value })
   }

   const toggleScopeFilter = async checked => {
      setScopeFilter({ isNational: checked, scope: checked ? [] : buildScope(currentUser) })
   }

   return (
      <Layout page="statistics" currentUser={currentUser}>
         <Title1 className="mt-5 mb-4">{"Statistiques"}</Title1>
         <Container className="text-center">
            <Form>
               <Row className="mb-4 align-items-baseline">
                  <Col lg={{ size: 4, offset: 2 }} md="6" sm="12" className="text-right">
                     <FormGroup row className="justify-content-md-end justify-content-center align-items-baseline">
                        <Label htmlFor="examinationDate" className="mr-2">
                           {"Du"}
                        </Label>
                        <Input
                           id="startDate"
                           type="date"
                           invalid={errors && !!errors.startDate}
                           value={formState.startDate}
                           onChange={onChange}
                           style={{ maxWidth: 160 }}
                        />
                     </FormGroup>
                  </Col>
                  <Col lg={{ size: 4 }} md="6" sm="12">
                     <FormGroup row className="justify-content-md-start justify-content-center align-items-baseline">
                        <Label htmlFor="examinationDate" className="mr-2 ml-md-3">
                           {"au"}
                        </Label>
                        <Input
                           id="endDate"
                           type="date"
                           invalid={errors && !!errors.startDate}
                           value={formState.endDate}
                           onChange={onChange}
                           style={{ maxWidth: 160 }}
                        />
                     </FormGroup>
                  </Col>
                  <Col lg={{ size: 2 }} md="12" sm="12">
                     <div className="d-flex justify-content-lg-end justify-content-center align-items-center mr-4">
                        <div className="d-flex align-items-center">
                           <span style={{ color: scopeFilter && scopeFilter.isNational ? "black" : "#307df6" }}>
                              Ma&nbsp;structure
                           </span>
                           <Switch
                              checked={scopeFilter && scopeFilter.isNational}
                              onChange={toggleScopeFilter}
                              onColor="#cd92d7"
                              onHandleColor="#9c27b0"
                              offColor="#b0cdfc"
                              offHandleColor="#307df6"
                              handleDiameter={20}
                              uncheckedIcon={false}
                              checkedIcon={false}
                              boxShadow="0px 1px 2px rgba(0, 0, 0, 0.6)"
                              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                              height={13}
                              width={33}
                              className="ml-1 mr-1 react-switch"
                              id="material-switch"
                           />
                           <span style={{ color: scopeFilter && scopeFilter.isNational ? "#9c27b0" : "#000" }}>
                              National
                           </span>
                        </div>
                     </div>
                  </Col>
               </Row>
            </Form>

            {!isEmpty(errors) && (
               <Alert color="danger" className="ml-5 mr-5">
                  <ul className="mb-0 d-flex justify-content-start align-items-center">
                     {errors && errors.startDate && <li>{errors.startDate}</li>}
                     {errors && errors.endDate && <li>{errors.endDate}</li>}
                  </ul>
               </Alert>
            )}

            <TabButton
               labels={["Global", "Vivant", "Thanato"]}
               colorScheme={scopeFilter && scopeFilter.isNational ? "violet" : "blue"}
               callback={setType}
            ></TabButton>

            {type === "Global" && (
               <div className="tab justify-content-sm-center justify-content-xl-start">
                  <StatBlockNumbers
                     title="Actes réalisés"
                     firstNumber={statistics.globalCount}
                     firstLabel={`Acte${pluralize(statistics.globalCount)} au total (tous confondus).`}
                     secondNumber={statistics.averageCount}
                     secondLabel={`Acte${pluralize(statistics.averageCount)} par jour en moyenne.`}
                  />
                  <StatBlockPieChart
                     data={livingDeceaseddData(statistics)}
                     hoverTitle="Hors assises et reconstitutions"
                     title="Répartition Vivant/Thanato"
                  />
                  <StatBlockNumbers
                     title="Actes hors examens"
                     firstNumber={statistics.profilesDistribution["Autre activité/Reconstitution"]}
                     firstLabel={`Reconstitution${pluralize(
                        statistics.profilesDistribution["Autre activité/Reconstitution"],
                     )}.`}
                     secondNumber={statistics.profilesDistribution["Autre activité/Assises"]}
                     secondLabel={`Participation${pluralize(
                        statistics.profilesDistribution["Autre activité/Assises"],
                     )} aux assises.`}
                  />
                  <StatBlockNumbers
                     title="Réquisitions"
                     firstNumber={statistics.actsWithSamePV}
                     firstLabel={`Acte${pluralize(statistics.actsWithSamePV)} avec le même numéro de réquisition.`}
                     secondNumber={statistics.averageWithSamePV}
                     secondLabel={`Acte${pluralize(
                        statistics.averageWithSamePV,
                     )} par numéro en moyenne sur ces numéros récurrents.`}
                  />
               </div>
            )}
            {type === "Vivant" && (
               <div className="tab justify-content-sm-center justify-content-xl-start">
                  <StatBlockNumbers
                     title="Actes réalisés"
                     firstNumber={statistics.globalCount}
                     firstLabel={`Acte${pluralize(statistics.globalCount)} au total (tous confondus).`}
                     secondNumber={statistics.averageCount}
                     secondLabel={`Acte${pluralize(statistics.averageCount)} par jour en moyenne.`}
                  />
                  <StatBlockPieChart data={actsWithPvData(statistics)} title="Numéro de réquisitions" />
                  <StatBlockPieChart data={actTypesData(statistics)} title="Types d'actes" />
                  <StatBlockPieChart
                     data={hoursData(statistics)}
                     title="Horaires"
                     hoverTitle="Journée (8h30-18h30) / Soirée (18h30-00h) / Nuit profonde (00h-8h30)"
                  />
                  <StatBlockPieChart data={examinationsData(statistics)} title="Examens complémentaires" />
               </div>
            )}
            {type === "Thanato" && (
               <div className="tab justify-content-sm-center justify-content-xl-start">
                  <StatBlockNumbers
                     title="Actes réalisés"
                     firstNumber={statistics.globalCount}
                     firstLabel={`Acte${pluralize(statistics.globalCount)} au total (tous confondus).`}
                     secondNumber={statistics.averageCount}
                     secondLabel={`Acte${pluralize(statistics.averageCount)} par jour en moyenne.`}
                  />
               </div>
            )}
         </Container>
         <style jsx>{`
            .tab {
               width: 100%;
               max-width: 1050 px;
               display: flex;
               flex-wrap: wrap;
               align-content: flex-start;
            }
         `}</style>
      </Layout>
   )
}

StatisticsPage.getInitialProps = async ctx => {
   const authHeaders = buildAuthHeaders(ctx)

   try {
      return { statistics: await memoizedFetchStatistics({ authHeaders }) }
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
