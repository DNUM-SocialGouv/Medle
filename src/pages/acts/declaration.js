import moment from "moment"
import Head from "next/head"
import Router, { useRouter } from "next/router"
import PropTypes from "prop-types"
import React, { useReducer, useRef, useState } from "react"
import { Alert, Col, Container, FormFeedback, FormText, Input, Row } from "reactstrap"

import { createAct, findAct, searchActsByKey, updateAct } from "../../clients/acts"
import ActBlock from "../../components/ActBlock"
import AskerSelect from "../../components/AskerSelect"
import { InputError } from "../../components/InputError"
import Layout from "../../components/Layout"
import { Label, Title1, Title2, ValidationButton } from "../../components/StyledComponents"
import { orderedProfileValues, profiles } from "../../utils/actsConstants"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../utils/auth"
import { ISO_DATE, now } from "../../utils/date"
import { logDebug, logError } from "../../utils/logger"
import { deleteProperty, isEmpty } from "../../utils/misc"
import { ACT_MANAGEMENT } from "../../utils/roles"

// internalNumber & pvNumber found by query, in update situation
const getInitialState = ({ act, internalNumber, pvNumber, userId, hospitalId }) => {
  if (act && act.id) {
    return { ...act, userId }
  } else {
    return {
      pvNumber: pvNumber || "",
      internalNumber: internalNumber || "",
      examinationDate: moment(now()).format(ISO_DATE),
      askerId: null,
      profile: "",
      addedBy: userId || "",
      hospitalId: hospitalId || "",
    }
  }
}

const resetState = ({
  pvNumber,
  internalNumber,
  examinationDate,
  askerId,
  profile,
  proofWithoutComplaint,
  addedBy,
  hospitalId,
}) => ({
  pvNumber,
  internalNumber,
  examinationDate,
  askerId,
  profile,
  proofWithoutComplaint,
  addedBy,
  hospitalId,
})

const hasErrors = (state) => {
  let errors = {}

  if (!state.profile) {
    errors = { ...errors, profile: "Obligatoire" }
  }
  if (!state.internalNumber) {
    errors = { ...errors, internalNumber: "Obligatoire" }
  }
  if (!state.examinationDate) {
    errors = { ...errors, examinationDate: "Obligatoire" }
  } else {
    const date = moment(state.examinationDate)
    if (!date.isValid()) {
      errors = { ...errors, examinationDate: "Format incorrect" }
    } else {
      const previousYear = now().year() - 2
      const limitInPast = moment(`${previousYear}-01-01`)

      if (date > now()) {
        errors = { ...errors, examinationDate: "La date doit être passée" }
      }
      if (date < limitInPast) {
        errors = { ...errors, examinationDate: `L'ajout d'acte antérieur à ${previousYear} n'est pas possible` }
      }
    }
  }

  if (!state.askerId && !state.proofWithoutComplaint) {
    errors = { ...errors, askerId: <InputError>{"Demandeur manquant ou invalide"}</InputError> }
  }

  return errors
}

const reduceByMode = (state, action) => {
  const newState = { ...state }

  switch (action.payload.mode) {
    case "toggle":
      if (state[action.type] === action.payload.val) {
        newState[action.type] = ""
      } else {
        newState[action.type] = action.payload.val
      }
      return newState
    case "toggleMultiple": {
      let newStateType = state[action.type] || []
      const index = newStateType.indexOf(action.payload.val)
      if (index !== -1) {
        newState[action.type] = [...newStateType.slice(0, index), ...newStateType.slice(index + 1)]
      } else {
        const chunks = action.payload.val.split("/")

        let prefix = ""
        if (chunks.length >= 2) {
          prefix = chunks[0]
          newStateType = newStateType.filter((e) => !e.startsWith(prefix))
        }

        newState[action.type] = [...newStateType, action.payload.val]
      }
      return newState
    }
    case "lock":
      newState[action.type] = newState[action.type] || action.payload.val
      return newState
    default:
      // regular replace
      newState[action.type] = action.payload.val
      return newState
  }
}

const ActDeclaration = ({ act, currentUser }) => {
  const router = useRouter()
  const { internalNumber, pvNumber } = router.query
  const refPerson = useRef(null)
  const [errors, setErrors] = useState({})
  const [warnings, setWarnings] = useState({})
  const [saving, setSaving] = useState(false)

  const { id: userId, hospital } = currentUser

  const hospitalId = (hospital && hospital.id) || null

  const reducer = (state, action) => {
    logDebug("reducer", state, action)

    setErrors(deleteProperty(errors, action.type))
    setWarnings(deleteProperty(warnings, action.type))

    switch (action.type) {
      case "examinationDate": {
        if (action?.payload?.val) {
          // when date is incorrect (if the user is currently typing the date), the val is "", so ignore it to not reset wrongly the date in state
          let newState = reduceByMode(state, action)
          // reset periodOfDay when examination date is updated
          newState = reduceByMode(newState, { type: "periodOfDay", payload: { val: "" } })
          return newState
        }

        return state
      }
      case "proofWithoutComplaint": {
        let newState = reduceByMode(state, action)
        setErrors(deleteProperty(errors, "askerId"))
        // reset askerId and pvNumber when proofWithoutComplaint is chosen
        newState = reduceByMode(newState, { type: "askerId", payload: { val: null } })
        newState = reduceByMode(newState, { type: "pvNumber", payload: { val: "" } })
        return newState
      }
      case "profile": {
        let newState = reduceByMode(state, action)

        if (action.payload.mode !== "lock") {
          newState = resetState(newState)
        }

        const errors = hasErrors(newState)

        if (!isEmpty(errors)) {
          setErrors(errors)
          logError(errors)
        } else {
          setErrors({})
          refPerson.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }

        return newState
      }
      default:
        return reduceByMode(state, action)
    }
  }

  const [state, dispatch] = useReducer(
    reducer,
    getInitialState({
      act,
      internalNumber,
      pvNumber,
      userId,
      hospitalId,
    }),
  )

  const getProfiledRender = ({ profile }) => {
    return profiles[profile].edit({ dispatch, state, errors, hospital })
  }

  const validAndSubmitAct = async () => {
    setSaving(true)
    setErrors({})

    let errors = hasErrors(state)

    if (state.profile) {
      errors = { ...errors, ...profiles[state.profile].hasErrors(state) }
    }

    if (!isEmpty(errors)) {
      setSaving(false)
      logError(`State non valide`, state)
      logError(errors)
      setErrors(errors)
      return
    }

    try {
      if (!state.id) {
        const { id } = await createAct({ act: state })

        logDebug("Created act id: ", id)
        return Router.push({
          pathname: "/acts/confirmation",
          query: {
            internalNumber: state.internalNumber,
            pvNumber: state.pvNumber,
          },
        })
      } else {
        const { updated } = await updateAct({ act: state })

        logDebug("Nb updated rows: ", updated)

        return Router.push({
          pathname: "/acts/confirmation",
          query: {
            internalNumber: state.internalNumber,
            pvNumber: state.pvNumber,
            edit: true,
          },
        })
      }
    } catch (error) {
      logError(error)
      setErrors((errors) => ({
        ...errors,
        general: error && error.message ? error.message : "Erreur serveur",
      }))
    } finally {
      setSaving(false)
    }
  }

  const shouldDisplayProfile = () => {
    //TODO: vérifier que les conditions sont toujours bonnes
    // creation case
    if (state.profile && !errors.internalNumber && !errors.examinationDate) return true
    // update case
    if (state.id) return true
    return false
  }

  const onBlurNumberInputs = (name) => async () => {
    if (state[name]) {
      try {
        const elements = await searchActsByKey({ key: name, value: state[name] })

        if (elements?.length) {
          setWarnings({ ...warnings, [name]: "Déjà utilisé" })
        } else {
          setWarnings({ ...warnings, [name]: null })
        }
      } catch (error) {
        logError("Erreur d'API pour recherche d'internal number")
        setWarnings({})
      }
    }
  }

  const profileTitle = "Qui a été examiné ?"

  if (!hospitalId)
    return (
      <Layout page="declaration" currentUser={currentUser}>
        <Head>
          <title>{!state.id ? "Ajout d'acte" : "Modification d'un acte"} - Medlé</title>
        </Head>
        <Title1 className="mt-5 mb-5">{!state.id ? "Ajout d'acte" : "Modification d'un acte"}</Title1>
        <Container style={{ maxWidth: 720 }}>
          <Alert color="danger">
            {"Cette fonctionnalité n'est disponible que si vous avez un établissement d'appartenance."}
          </Alert>
        </Container>
      </Layout>
    )

  return (
    <Layout page="declaration" currentUser={currentUser}>
      <Head>
        <title>{!state.id ? "Ajout d'acte" : "Modification d'un acte"} - Medlé</title>
      </Head>
      <Title1 className="mt-5 mb-5">{!state.id ? "Ajout d'acte" : "Modification d'un acte"}</Title1>
      <Container style={{ maxWidth: 720 }}>
        <div role="group" aria-label="Données d'identification de l'acte">
          <Title2 className="mb-4">{"Données d'identification de l'acte"}</Title2>

          <Row>
            <Col sm="6" md="4">
              <Label htmlFor="internalNumber" className="mb-0">
                Numéro interne
              </Label>
              <Input
                id="internalNumber"
                invalid={errors && !!errors.internalNumber}
                placeholder="Ex: 2019-23091"
                value={state.internalNumber}
                onChange={(e) => dispatch({ type: e.target.id, payload: { val: e.target.value } })}
                autoComplete="off"
                onBlur={onBlurNumberInputs("internalNumber")}
                aria-required="true"
              />
              {warnings && warnings.internalNumber && <FormText color="warning">Ce numéro existe déjà</FormText>}
              <FormFeedback>
                <InputError>{errors && errors.internalNumber}</InputError>
              </FormFeedback>
            </Col>
            <Col sm="6" md="4" className="mt-3 mt-sm-0">
              <Label htmlFor="examinationDate" className="mb-0">
                {"Date d'examen"}
              </Label>
              <Input
                id="examinationDate"
                invalid={errors && !!errors.examinationDate}
                type="date"
                value={state.examinationDate || moment(now()).format(ISO_DATE)}
                // value={state.examinationDate}
                onChange={(e) => dispatch({ type: e.target.id, payload: { val: e.target.value } })}
              />
              <FormFeedback>
                <InputError>{errors && errors.examinationDate}</InputError>
              </FormFeedback>
            </Col>
            <Col className="mt-4 text-center mt-md-0" sm="12" md="4">
              <Label
                htmlFor="proofWithoutComplaint"
                className="mb-0"
                style={{ display: "block", height: "auto", paddingBottom: "0.5em" }}
              >
                Victime hors réquisition judiciaire
                <br /> <small>(recueil de preuve sans plainte)</small>
              </Label>
              <Input
                type="checkbox"
                name="proofWithoutComplaint"
                id="proofWithoutComplaint"
                value={state.proofWithoutComplaint || false}
                checked={state.proofWithoutComplaint || false}
                style={{ margin: "auto" }}
                onChange={(e) => dispatch({ type: e.target.id, payload: { val: e.target.checked } })}
              />
            </Col>
          </Row>
          <Row className="mt-4 mt-md-3">
            <Col md="4">
              <Label htmlFor="pvNumber" className="mb-0">
                Numéro de PV
              </Label>
              <Input
                id="pvNumber"
                placeholder={state.proofWithoutComplaint ? "" : "Recommandé"}
                value={state.pvNumber}
                disabled={!!state.proofWithoutComplaint}
                onChange={(e) => dispatch({ type: e.target.id, payload: { val: e.target.value } })}
                autoComplete="off"
                onBlur={onBlurNumberInputs("pvNumber")}
              />
              {warnings && warnings.pvNumber && <FormText color="warning">Ce numéro existe déjà</FormText>}
            </Col>
            <Col md="8" className="mt-3 mt-md-0">
              <Label htmlFor="askerId" className="mb-0">
                Demandeur
              </Label>
              <AskerSelect
                dispatch={dispatch}
                id="askerId"
                askerId={state.askerId}
                disabled={!!state.proofWithoutComplaint}
                error={errors && errors.askerId ? errors.askerId : null}
              />
              <div style={{ color: "#d63626", fontSize: "80%" }} className="d-flex align-items-center">
                {errors && errors.askerId}
              </div>
            </Col>
          </Row>
        </div>

        <div ref={refPerson}>
          {state.proofWithoutComplaint ? (
            <ActBlock
              type="profile"
              title={profileTitle}
              values={["Victime (vivante)"]}
              mode="toggle"
              dispatch={dispatch}
              state={state.profile}
            />
          ) : !state.id ? (
            <ActBlock
              type="profile"
              title={profileTitle}
              values={orderedProfileValues}
              mode="toggle"
              dispatch={dispatch}
              state={state.profile}
            />
          ) : (
            <ActBlock
              type="profile"
              title={profileTitle}
              values={[state.profile]}
              mode="lock"
              dispatch={dispatch}
              state={state.profile}
            />
          )}
        </div>

        {shouldDisplayProfile() && getProfiledRender(state)}

        {!isEmpty(errors) && (
          <Alert color="danger">
            {errors.general
              ? errors.general
              : "Il y a des erreurs dans le formulaire. Veuillez remplir les éléments affichés en rouge."}
          </Alert>
        )}

        <div className="mt-5 text-center">
          <ValidationButton color="primary" size="lg" className="center" onClick={validAndSubmitAct} disabled={saving}>
            {state.id ? "Modifier" : "Valider"}
          </ValidationButton>
        </div>
      </Container>
    </Layout>
  )
}

ActDeclaration.propTypes = {
  act: PropTypes.object,
  error: PropTypes.string,
  currentUser: PropTypes.object.isRequired,
}

const transformDBActForState = (act) => {
  const newAct = {
    ...act,
    askerId: act.asker && act.asker.id ? act.asker.id : null,
    hospitalId: act.hospital && act.hospital.id ? act.hospital.id : "",
  }

  delete newAct.asker
  delete newAct.hospital
  delete newAct.user
  return newAct
}

ActDeclaration.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)
  const { query } = ctx

  try {
    if (!query || !query.id) return { act: {} }

    const act = await findAct({ id: query.id, headers })

    return { act: transformDBActForState(act) || {} }
  } catch (error) {
    logError(error)
    redirectIfUnauthorized(error, ctx)
  }
}

export default withAuthentication(ActDeclaration, ACT_MANAGEMENT)
