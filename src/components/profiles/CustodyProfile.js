import React from "react"
import ActBlock from "../ActBlock"
import PropTypes from "prop-types"
import { Title2 } from "../StyledComponents"
import { Col, Row } from "reactstrap"
import ColumnAct from "../../components/ColumnAct"
import { periodOfDayValues, getSituationDate } from "../../utils/actsConstants"

const CustodyEdit = ({ dispatch, state, errors }) => {
  const situationDate = getSituationDate(state.examinationDate)
  const periods = periodOfDayValues[situationDate].period.map((elt) => ({ title: elt.title, subTitle: elt.subTitle }))

  if (!state.personIsPresent)
    dispatch({
      type: "personIsPresent",
      payload: {
        mode: "toggle",
        val: "Oui",
      },
    })

  return (
    <>
      <ActBlock
        type="personIsPresent"
        title="La personne en GAV était-elle présente ?"
        detail="Si la personne n’a pas pu être examinée car absente (ex: GAV terminée plus tôt), cochez non."
        values={["Oui", "Non"]}
        mode="toggle"
        dispatch={dispatch}
        state={state.personIsPresent}
        invalid={!!errors.personIsPresent}
      />

      {state.personIsPresent && state.personIsPresent.includes("Oui") && (
        <>
          <ActBlock
            type="examinationTypes"
            title="Type(s) d'acte"
            detail="Note : l'examen psychiatrique est réalisé sur réquisition judiciaire par un psychiatre. Ne sont pas concernées : expertise pénale, évaluation psychologique."
            values={["Somatique", "Psychiatrique"]}
            mode="toggleMultiple"
            dispatch={dispatch}
            state={state.examinationTypes || []}
            invalid={!!errors.examinationTypes}
          />
          <ActBlock
            type="examinations"
            title="Prélèvements et examens complémentaires"
            values={["Biologie", "Imagerie", "Toxicologie", "Génétique", "Autres"]}
            mode="toggleMultiple"
            dispatch={dispatch}
            state={state.examinations || []}
            invalid={!!errors.examinations}
          />
          <ActBlock
            type="periodOfDay"
            title="Heure de l'examen"
            values={periods}
            mode="toggle"
            dispatch={dispatch}
            state={state.periodOfDay || ""}
            invalid={!!errors.periodOfDay}
          />
          <ActBlock
            type="location"
            title="Lieu de l'examen"
            values={["UMJ", "Commissariat", "Gendarmerie", "Tribunal", "Service hosp. public"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.location || ""}
            invalid={!!errors.location}
          />

          <Title2 className="mt-5 mb-2">{"Profil de la personne gardée à vue"}</Title2>

          <ActBlock
            type="personGender"
            title=""
            subTitle="Genre"
            values={["Féminin", "Masculin", "Autre genre", "Non déterminé"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.personGender || ""}
            invalid={!!errors.personGender}
          />
          <ActBlock
            type="personAgeTag"
            title=""
            subTitle="Âge"
            values={["Mineur", "Majeur", "Non déterminé"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.personAgeTag || ""}
            invalid={!!errors.personAgeTag}
          />
        </>
      )}
    </>
  )
}

const CustodyRead = (act) => {
  if (act.personIsPresent === "Non")
    return (
      <>
        <Row>
          <Col className="mr-3">
            <ColumnAct header={"Statut"} content={act && act.profile} />
          </Col>
          <Col className="mr-3">
            <ColumnAct header={"Présence de la personne en GAV"} content="Non" />
          </Col>
        </Row>
      </>
    )
  else
    return (
      <>
        <Row>
          <Col className="mr-3">
            <ColumnAct header={"Statut"} content={act && act.profile} />
          </Col>
          <Col className="mr-3">
            <ColumnAct header={"Présence de la personne en GAV"} content="Oui" />
          </Col>
        </Row>
        <Row>
          <Col className="mr-3">
            <ColumnAct header={"Type(s) d'acte"} content={act && act.examinationTypes} />
          </Col>
          <Col className="mr-3">
            <ColumnAct header={"Prélèvements et examens complémentaires"} content={act && act.examinations} />
          </Col>
        </Row>

        <Row>
          <Col className="mr-3">
            <ColumnAct header={"Lieu de l'examen"} content={act.location} />
          </Col>
          <Col className="mr-3"></Col>
          <Col className="mr-3"></Col>
        </Row>

        <Title2 className="pt-3">Profil</Title2>

        <Row>
          <Col className="mr-3">
            <ColumnAct header={"Genre"} content={act && act.personGender} />
          </Col>
          <Col className="mr-3">
            <ColumnAct header={"Âge"} content={act && act.personAgeTag} />
          </Col>
          <Col className="mr-3"></Col>
          <Col className="mr-3"></Col>
        </Row>
      </>
    )
}

const hasErrors = (state) => {
  const errors = {}

  if (!state.personIsPresent) {
    errors.personIsPresent = "Obligatoire"
  }
  if (state.personIsPresent === "Oui") {
    if (!state.examinationTypes?.length) {
      errors.examinationTypes = "Obligatoire"
    }
    if (!state.location) {
      errors.location = "Obligatoire"
    }
    if (!state.periodOfDay) {
      errors.periodOfDay = "Obligatoire"
    }
    if (!state.personGender) {
      errors.personGender = "Obligatoire"
    }
    if (!state.personAgeTag) {
      errors.personAgeTag = "Obligatoire"
    }
  }

  return errors
}

CustodyEdit.propTypes = {
  dispatch: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  errors: PropTypes.object,
}

export default {
  edit: CustodyEdit,
  read: CustodyRead,
  hasErrors,
}
