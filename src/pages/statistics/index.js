import React, { useState, useEffect, useCallback, useMemo } from "react"
import { PropTypes } from "prop-types"
import { Alert, Col, Container, Form, FormGroup, Input, Row } from "reactstrap"
import Switch from "react-switch"
import ListAltIcon from "@material-ui/icons/ListAlt"
import Select from "react-select"

import { isOpenFeature } from "../../config"
import Layout from "../../components/Layout"
import TabButton from "../../components/TabButton"
import { Label, Title1 } from "../../components/StyledComponents"
import { PUBLIC_SUPERVISOR, REGIONAL_SUPERVISOR, SUPER_ADMIN, STATS_GLOBAL } from "../../utils/roles"
import { buildAuthHeaders, withAuthentication } from "../../utils/auth"
import { logDebug } from "../../utils/logger"
import { isEmpty, pluralize } from "../../utils/misc"
import { StatBlockNumbers, StatBlockPieChart } from "../../components/StatBlock"
import { isValidStartDate, isValidEndDate } from "../../services/statistics/common"
import { buildScope } from "../../services/scope"
import { SearchButton } from "../../components/form/SearchButton"
import { fetchExport, memoizedFetchStatistics } from "../../clients/statistics"
import { mapArrayForSelect } from "../../utils/select"
import { getReferenceData } from "../../utils/init"
import { livingProfiles } from "../../utils/actsConstants"

const supervisorRoles = [PUBLIC_SUPERVISOR, REGIONAL_SUPERVISOR, SUPER_ADMIN]

const defaultProfile = { value: "", label: "Tous les profils" }
const profileChoices = [defaultProfile, ...livingProfiles]

const StatisticsPage = ({ statistics: _statistics, currentUser }) => {
  const [statistics, setStatistics] = useState(_statistics)
  const [type, setType] = useState("Global")
  const [scopeFilter, setScopeFilter] = useState({ isNational: true, scope: [] })
  const [selectedProfile, setSelectedProfile] = useState(defaultProfile)
  const [formState, setFormState] = useState({
    startDate: statistics?.inputs?.startDate,
    endDate: statistics?.inputs?.endDate,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    logDebug("Remove statistics cache")
    memoizedFetchStatistics.clear()
  }, [])

  useEffect(() => {
    logDebug("Update UI after state changes")
    const syncUI = async () => {
      const profile = ["Global", "Thanato"].includes(type) ? "" : selectedProfile?.value

      const statistics = await memoizedFetchStatistics({
        type,
        startDate: formState.startDate,
        endDate: formState.endDate,
        scopeFilter: scopeFilter.scope?.map((elt) => elt.value),
        profile,
      })
      setStatistics(statistics)
    }

    const errors = {}

    if (!isValidStartDate(formState.startDate, formState.endDate))
      errors.startDate = "La date de début doit être avant la date de fin."
    if (!isValidEndDate(formState.endDate)) errors.endDate = "La date de fin ne doit pas être future."

    if (isEmpty(errors)) {
      setErrors({})
      syncUI()
    } else {
      setErrors(errors)
    }
  }, [formState.endDate, formState.startDate, scopeFilter.scope, type, selectedProfile])

  const scope = useMemo(() => buildScope(currentUser), [currentUser])

  const hospitalsChoices = useCallback(
    mapArrayForSelect(
      scope?.length === 0
        ? getReferenceData("hospitals")
        : getReferenceData("hospitals").filter((hospital) => scope.includes(hospital.id)),
      (elt) => elt.id,
      (elt) => elt.name
    ),
    [scope]
  )
  const toggleScopeFilter = async (checked) => {
    setScopeFilter({ isNational: checked, scope: checked || scope?.length === 0 ? [] : hospitalsChoices })
  }

  const onDateChange = (e) => {
    // value is empty when the date is not correct, for example when the user is in the process of typing
    if (e.target.value) {
      setFormState({ ...formState, [e.target.id]: e.target.value })
    }
  }

  const onScopeChange = (selectedOption) => {
    setScopeFilter({ ...scopeFilter, scope: selectedOption || [] })
  }

  const onProfileChange = (selectedOption) => {
    setSelectedProfile(selectedOption)
  }

  const onExport = async () => {
    await fetchExport({
      type,
      startDate: formState.startDate,
      endDate: formState.endDate,
      scopeFilter: scopeFilter.scope?.map((elt) => elt.value),
      profile: selectedProfile?.value,
    })
  }

  const customStyles = {
    container: (styles) => ({
      ...styles,
      flexGrow: 1,
    }),
    menu: (styles) => ({
      ...styles,
      textAlign: "left",
    }),
  }
  const customStylesProfiles = {
    container: (styles) => ({
      ...styles,
      width: 300,
      margin: "15px 20px",
    }),
    menu: (styles) => ({
      ...styles,
      textAlign: "left",
    }),
  }

  return (
    <Layout page="statistics" currentUser={currentUser}>
      <Title1 className="mt-5 mb-4">{"Statistiques"}</Title1>
      <Container className="text-center" style={{ maxWidth: 1100 }}>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Row className="align-items-baseline">
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
                  onChange={onDateChange}
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
                  onChange={onDateChange}
                  style={{ maxWidth: 160 }}
                />
              </FormGroup>
            </Col>

            <Col lg={{ size: 2 }} md="12" sm="12">
              <div className="mb-4 mr-4 d-flex justify-content-lg-end justify-content-center align-items-center">
                <div className="d-flex align-items-center">
                  <span style={{ color: scopeFilter && scopeFilter.isNational ? "black" : "#307df6" }}>
                    {supervisorRoles.includes(currentUser?.role) ? "Personnalisé" : "Ma\xA0structure"}
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
                  <span style={{ color: scopeFilter && scopeFilter.isNational ? "#9c27b0" : "#000" }}>National</span>
                </div>
              </div>
            </Col>
          </Row>

          {!scopeFilter.isNational && hospitalsChoices?.length > 1 && (
            <div className="mx-auto d-lg-flex align-items-baseline" style={{ maxWidth: 800 }}>
              <Label className="mr-3">Établissements</Label>
              <Select
                options={hospitalsChoices}
                value={scopeFilter.scope}
                isMulti
                onChange={onScopeChange}
                noOptionsMessage={() => "Aucun résultat"}
                placeholder="Tapez les premières lettres d'un établissement"
                isClearable={true}
                isSearchable={true}
                styles={customStyles}
              />
            </div>
          )}
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
        />

        <div
          className={`d-flex w-100 justify-content-center justify-content-md-end mr-5 mt-2 mb-3 ${
            type === "Vivant" ? "visible" : "invisible"
          }`}
        >
          <Select
            options={profileChoices}
            value={selectedProfile}
            onChange={onProfileChange}
            noOptionsMessage={() => "Aucun résultat"}
            isClearable={false}
            isSearchable={true}
            styles={customStylesProfiles}
          />
        </div>
        {type === "Global" && (
          <div className="tab justify-content-center justify-content-xl-start">
            <StatBlockNumbers
              title="Actes réalisés"
              firstNumber={statistics?.globalCount}
              firstLabel={`Acte${pluralize(statistics?.globalCount)} au total (tous confondus).`}
              secondNumber={statistics?.averageCount}
              secondLabel={`Acte${pluralize(statistics?.averageCount)} par jour par ETS en moyenne.`}
            />

            <StatBlockPieChart
              data={statistics?.profilesDistribution}
              labels={[{ Vivants: "Pers. vivantes" }, { "Personne décédée": "Pers. décédées" }]}
              hoverTitle="Hors assises et reconstitutions"
              title="Répartition Vivant/Thanato"
            />
            <StatBlockNumbers
              title="Actes hors examens"
              firstNumber={statistics?.profilesDistribution?.["Autre activité/Reconstitution"]}
              firstLabel={`Reconstitution${pluralize(
                statistics?.profilesDistribution?.["Autre activité/Reconstitution"]
              )}.`}
              secondNumber={statistics?.profilesDistribution?.["Autre activité/Assises"]}
              secondLabel={`Participation${pluralize(
                statistics?.profilesDistribution?.["Autre activité/Assises"]
              )} aux assises.`}
            />
            <StatBlockNumbers
              title="Réquisitions"
              firstNumber={statistics?.actsWithSamePV}
              firstLabel={`Acte${pluralize(statistics?.actsWithSamePV)} avec le même numéro de réquisition.`}
              secondNumber={statistics?.averageWithSamePV}
              secondLabel={`Nombre moyen d'actes par numéro de réquisition.`}
            />
          </div>
        )}
        {type === "Vivant" && (
          <div className="tab justify-content-center justify-content-xl-start">
            <StatBlockNumbers
              title="Actes réalisés"
              firstNumber={statistics?.globalCount}
              firstLabel={`Acte${pluralize(statistics?.globalCount)} au total (tous confondus).`}
              secondNumber={statistics?.averageCount}
              secondLabel={`Acte${pluralize(statistics?.averageCount)} par jour par ETS en moyenne.`}
            />
            <StatBlockPieChart
              data={statistics?.actsWithPv}
              title="Numéro de réquisition"
              labels={[
                { "Avec réquisition": "Avec n° de réquisition" },
                { "Sans réquisition": "Sans n° de réquisition" },
                "Recueil de preuve sans plainte",
              ]}
            />
            <StatBlockPieChart data={statistics?.actTypes} title="Types d'actes" />
            <StatBlockPieChart
              data={statistics?.hours}
              title="Horaires"
              hoverTitle="Journée (8h30-18h30) / Soirée (18h30-00h) / Nuit profonde (00h-8h30)"
            />
            <StatBlockPieChart data={statistics?.examinations} title="Examens complémentaires" />
          </div>
        )}
        {type === "Thanato" && (
          <div className="tab justify-content-center justify-content-xl-start">
            <StatBlockNumbers
              title="Actes réalisés"
              firstNumber={statistics?.globalCount}
              firstLabel={`Acte${pluralize(statistics?.globalCount)} au total (tous confondus).`}
              secondNumber={statistics?.averageCount}
              secondLabel={`Acte${pluralize(statistics?.averageCount)} par jour par ETS en moyenne.`}
            />
            <StatBlockPieChart
              data={statistics?.actsWithPv}
              title="Numéro de réquisition"
              labels={[
                { "Avec réquisition": "Avec n° de réquisition" },
                { "Sans réquisition": "Sans n° de réquisition" },
              ]}
            />
            <StatBlockPieChart data={statistics?.actTypes} title="Types d'actes" />
            <StatBlockPieChart
              data={statistics?.hours}
              title="Horaires"
              hoverTitle="Journée (8h30-18h30) / Soirée (18h30-00h) / Nuit profonde (00h-8h30)"
            />
            <StatBlockPieChart data={statistics?.examinations} title="Examens complémentaires" />
          </div>
        )}
        {isOpenFeature("export") && (
          <div className="mt-5 d-flex justify-content-center">
            <SearchButton className="btn-outline-primary" onClick={onExport}>
              <ListAltIcon /> Exporter les données
            </SearchButton>
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

StatisticsPage.getInitialProps = async (ctx) => {
  const authHeaders = buildAuthHeaders(ctx)

  return { statistics: await memoizedFetchStatistics({ authHeaders }) }
}

StatisticsPage.propTypes = {
  statistics: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(StatisticsPage, STATS_GLOBAL)
