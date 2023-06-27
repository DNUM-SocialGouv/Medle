import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import ArrowRightIcon from "@material-ui/icons/ArrowRight"
import ListAltIcon from "@material-ui/icons/ListAlt"
import Head from "next/head"
import Link from "next/link"
import PropTypes from "prop-types"
import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import Select from "react-select"
import AsyncSelect from "react-select/async"
import { Alert, Button, Col, Container, Form, FormGroup, Label, Row, Table } from "reactstrap"

import { fetchExport, searchActs } from "../../clients/acts"
import { memoizedSearchAskers } from "../../clients/askers"
import { SearchButton } from "../../components/form/SearchButton"
import Layout from "../../components/Layout"
import Pagination from "../../components/Pagination"
import { InputDarker, Title1 } from "../../components/StyledComponents"
import { VerticalList } from "../../components/VerticalList"
import { isOpenFeature, LIMIT_EXPORT } from "../../config"
import { useDebounce } from "../../hooks/useDebounce"
import { usePaginatedData } from "../../hooks/usePaginatedData"
import { profiles as profilesConstants } from "../../utils/actsConstants"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../utils/auth"
import { isoToFr } from "../../utils/date"
import { getReferenceData } from "../../utils/init"
import { logError } from "../../utils/logger"
import { ACT_CONSULTATION } from "../../utils/roles"
import { buildScope } from "../../utils/scope"
import { ariaLiveMessagesFR, mapArrayForSelect, reactSelectCustomTheme } from "../../utils/select"
import { useRouter } from "next/router"

const ActsListPage = ({ paginatedData: initialPaginatedData, currentUser }) => {
  // const renderCount = React.useRef(0)
  // renderCount.current++

  const [paginatedData, error, loading, fetchPage] = usePaginatedData(searchActs, initialPaginatedData)
  const router = useRouter()
  const [isOpenedFilters, setOpenedFilters] = useState(false)
  const { register, unregister, handleSubmit, setValue, getValues } = useForm({})
  const [hospitals, setHospitals] = useState([])
  const [profiles, setProfiles] = useState([])
  const [asker, setAsker] = useState(null)
  const [search, setSearch] = useState("")
  useDebounce(onChange, 500, [search])
  const scope = useMemo(() => buildScope(currentUser), [currentUser])
  const [errorExport, setErrorExport] = useState("")

  const hospitalsChoices = useMemo(
    () =>
      mapArrayForSelect(
        scope?.length === 0
          ? getReferenceData("hospitals")
          : getReferenceData("hospitals").filter((hospital) => scope.includes(hospital.id)),
        (elt) => elt.id,
        (elt) => elt.name,
      ),
    [scope],
  )

  const existingProfiles = useMemo(
    () =>
      mapArrayForSelect(
        Object.keys(profilesConstants) || [],
        (elt) => elt,
        (elt) => elt,
      ),
    [],
  )

  // Darker color for Select
  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white", borderColor: "#555C64", color: "#555C64" }),
    placeholder: (styles) => ({ ...styles, color: "#555C64" }),
    indicatorSeparator: (styles) => ({ ...styles, backgroundColor: "#555C64" }),
    dropdownIndicator: (styles) => ({ ...styles, color: "#555C64" }),
  }

  useEffect(() => {
    // Extra field in form to store the value of selects
    register("hospitals")
    register("profiles")
    register("asker")
    register("search")

    return () => {
      unregister("hospitals")
      unregister("profiles")
      unregister("asker")
      unregister("search")
    }
  }, [register, unregister])

  const numFilters = Object.values(getValues()).filter((val) => !!val).length

  function toggleFilters() {
    setOpenedFilters((state) => !state)
    onChange()
  }

  function onHospitalsChange(selectedOption) {
    // Needs transformation between format of react-select to expected format for API call
    setValue("hospitals", !selectedOption?.length ? null : selectedOption)
    // Needs to sync specifically the value to the react-select as well
    setHospitals(selectedOption)
    onChange()
  }

  function onProfilesChange(selectedOption) {
    // Needs transformation between format of react-select to expected format for API call
    setValue("profiles", !selectedOption?.length ? null : selectedOption)

    // Needs to sync specifically the value to the react-select as well
    setProfiles(selectedOption)
    onChange()
  }

  function onAskerChange(selectedOption) {
    // Needs transformation between format of react-select to expected format for API call
    setValue("asker", selectedOption)

    // Needs to sync specifically the value to the react-select as well
    setAsker(selectedOption)
    onChange()
  }

  function onSearchChange(e) {
    const text = e?.target?.value || ""
    setSearch(text)
    setValue("search", text)
  }

  function onStartDateChange(e) {
    const startDate = e?.target?.value || ""
    setValue("startDate", startDate)
    onChange()
  }

  function onEndDateChange(e) {
    const endDate = e?.target?.value || ""
    setValue("endDate", endDate)
    onChange()
  }

  async function loadAskers(search) {
    const askers = await memoizedSearchAskers({ search })

    return mapArrayForSelect(
      askers?.elements,
      (elt) => elt.id,
      (elt) => elt.name + (elt.depCode ? ` (${elt.depCode})` : ""),
    )
  }

  function onChange() {
    onSubmit(getValues())
    setErrorExport("")
  }

  function onSubmit(formData) {
    fetchPage(formData)(0)
  }

  async function onExport() {
    if (paginatedData.totalCount > LIMIT_EXPORT) {
      setErrorExport(`Le nombre d'éléments dépasse ${LIMIT_EXPORT}. Veuillez filtrer votre recherche, s'il vous plaît.`)
    }
    await fetchExport(getValues())
  }

  const { ref: startDateRef, ...startDateReg } = register("startDate")
  const { ref: endDateRef, ...endDateReg } = register("endDate")

  return (
    <Layout page="acts" currentUser={currentUser}>
      <Head>
        <title>Tous les actes - Medlé</title>
      </Head>
      <Title1 className="mt-5 mb-4">{"Tous les actes"}</Title1>
      <Container style={{ maxWidth: 980 }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup inline className="mb-4 justify-content-center" role="group" aria-label="Recherche d'actes">
            <Row>
              <Col className="flex-grow-1">
                <InputDarker
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Rechercher un acte ou plusieurs, par n° interne ou n° de PV"
                  autoComplete="off"
                  value={search}
                  aria-label="Rechercher un acte ou plusieurs, par numéro interne ou numéro de PV"
                  onChange={onSearchChange}
                  role="search"
                />
              </Col>
            </Row>
            {isOpenFeature("export") && (
              <>
                <Row className="mt-3">
                  <Col>
                    <Button className="mr-3" color="secondary" outline={!isOpenedFilters} onClick={toggleFilters}>
                      Plus de critères {isOpenedFilters ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                    </Button>
                    {numFilters > 0 && (
                      <span style={{ color: "#6c757d" }}>
                        {numFilters} critère{numFilters > 1 && "s"} actif{numFilters > 1 && "s"}
                      </span>
                    )}
                  </Col>
                </Row>
                {isOpenFeature("export") && (
                  <div
                    className="p-3 mt-3 border rounded shadow-xl border-light bg-light"
                    style={{ display: isOpenedFilters ? "block" : "none" }}
                  >
                    <Row>
                      <Col sm="3">
                        <Label htmlFor="startDate" className="text-dark">
                          Date de début
                        </Label>
                        <InputDarker
                          type="date"
                          id="startDate"
                          placeholder="Date de début"
                          {...startDateReg}
                          innerRef={startDateRef}
                          onChange={onStartDateChange}
                        />
                      </Col>
                      <Col sm="3">
                        <Label htmlFor="endDate" className="text-dark">
                          Date de fin
                        </Label>
                        <InputDarker
                          type="date"
                          id="endDate"
                          placeholder="Date de fin"
                          {...endDateReg}
                          innerRef={endDateRef}
                          onChange={onEndDateChange}
                        />
                      </Col>
                    </Row>
                    {hospitalsChoices?.length > 1 && (
                      <Row className="mt-3">
                        <Col>
                          <Label className="text-dark" id="hospitalsLabel">
                            Établissements
                          </Label>
                          <Select
                            id="hospitals"
                            options={hospitalsChoices}
                            value={hospitals}
                            isMulti
                            onChange={onHospitalsChange}
                            noOptionsMessage={() => "Aucun résultat"}
                            placeholder="Choisissez un établissement de votre périmètre"
                            isClearable={true}
                            isSearchable={true}
                            styles={colourStyles}
                            aria-labelledby="hospitalsLabel"
                            ariaLiveMessages={ariaLiveMessagesFR}
                            theme={reactSelectCustomTheme}
                          />
                        </Col>
                      </Row>
                    )}{" "}
                    <Row className="mt-3">
                      <Col>
                        <Label className="text-dark" id="profilesLabel">
                          Profils et autres activités
                        </Label>
                        <Select
                          id="profiles"
                          options={existingProfiles}
                          value={profiles}
                          isMulti
                          onChange={onProfilesChange}
                          noOptionsMessage={() => "Aucun résultat"}
                          placeholder="Choisissez un profil ou activité"
                          isClearable={true}
                          isSearchable={true}
                          styles={colourStyles}
                          aria-labelledby="profilesLabel"
                          ariaLiveMessages={ariaLiveMessagesFR}
                          theme={reactSelectCustomTheme}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col>
                        <Label className="text-dark" id="askerLabel">
                          Demandeur
                        </Label>
                        <AsyncSelect
                          id="asker"
                          loadOptions={(search) => loadAskers(search)}
                          placeholder="Tapez le nom du demandeur"
                          noOptionsMessage={() => "Aucun résultat"}
                          loadingMessage={() => "Chargement..."}
                          onChange={onAskerChange}
                          isClearable={true}
                          isSearchable={true}
                          value={asker}
                          styles={colourStyles}
                          aria-labelledby="askerLabel"
                          ariaLiveMessages={ariaLiveMessagesFR}
                        />
                      </Col>
                    </Row>
                  </div>
                )}
              </>
            )}
          </FormGroup>
        </Form>
        {error && (
          <Alert color="danger" className="mb-4">
            {error}
          </Alert>
        )}
        {!error && !paginatedData?.elements?.length && <div className="text-center">{"Aucun acte trouvé."}</div>}

        {!error && !!paginatedData?.elements?.length && (
          <>
            <div className="my-4 d-flex justify-content-center">
              <b>{paginatedData.totalCount}</b>&nbsp;résultat{paginatedData.totalCount > 1 && "s"}
            </div>
            <Table responsive className="table-hover">
              <thead>
                <tr className="table-light">
                  <th scope="col" id="internNumber" aria-label="Numéro dossier interne">
                    N° dossier interne
                  </th>
                  <th scope="col" id="PvNumber" aria-label="Numéro PV">
                    N° PV
                  </th>
                  <th scope="col" id="date">
                    Date
                  </th>
                  <th scope="col" id="profilType">
                    Type de profil
                  </th>
                  <th scope="col" id="ActType">
                    {"Type d'acte"}
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {paginatedData.elements.map((act) => (
                    <tr key={act.id} style={{ cursor: "pointer" }} onClick={() => router.push(`/acts/${act.id}`)}>
                      <td>
                        <b>{act.internalNumber}</b>
                      </td>
                      <td>{act.pvNumber}</td>
                      <td>{act.examinationDate && isoToFr(act.examinationDate)}</td>
                      <td>{act.profile}</td>
                      <td>{act.examinationTypes && <VerticalList content={act.examinationTypes} />}</td>
                      <td className="text-decoration">
                        <Link href="/acts/[id]" as={`/acts/${act.id}`}
                           className="text-decoration-none" aria-label={"Voir l'acte numéro " + act.internalNumber}>
                            Voir
                        </Link>
                      </td>
                    </tr>
                ))}
              </tbody>
            </Table>
            <Pagination data={paginatedData} fn={fetchPage(getValues())} />
            {isOpenFeature("export") && (
              <>
                <div className="mt-5 d-flex justify-content-center">
                  <SearchButton className="btn-outline-primary" disabled={loading} onClick={onExport}>
                    <ListAltIcon /> Exporter les données
                  </SearchButton>
                </div>
                <div style={{ color: "#EE0700" }} className="mt-3 text-center" role="alert">
                  {errorExport}
                </div>
              </>
            )}
          </>
        )}
      </Container>
    </Layout>
  )
}

ActsListPage.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)
  try {
    const paginatedData = await searchActs({ headers })
    return { paginatedData }
  } catch (error) {
    logError("APP error", error)

    redirectIfUnauthorized(error, ctx)
  }
  return {}
}

ActsListPage.propTypes = {
  currentUser: PropTypes.object.isRequired,
  paginatedData: PropTypes.object.isRequired,
}

export default withAuthentication(ActsListPage, ACT_CONSULTATION)
