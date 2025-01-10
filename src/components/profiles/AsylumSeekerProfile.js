import PropTypes from "prop-types"
import React from "react"
import { Col, Row } from "reactstrap"

import { getSituationDate, periodOfDayValues } from "../../utils/actsConstants"
import ActBlock from "../ActBlock"
import ColumnAct from "../ColumnAct"
import { Title2 } from "../StyledComponents"

const AsylumSeekerEdit = ({ dispatch, state, errors, profileLocations }) => {
  const situationDate = getSituationDate(state.examinationDate)
  const periods = periodOfDayValues[situationDate].period.map((elt) => ({ title: elt.title, subTitle: elt.subTitle }))

  const personTitle = "Profil de la personne examinée"

  if (!state.honoredMeeting)
    dispatch({
      type: "honoredMeeting",
      payload: {
        mode: "toggle",
        val: "Oui",
      },
    })

  return (
    <>
      <ActBlock
        type="honoredMeeting"
        title="Le rendez-vous a-t-il été honoré ?"
        detail="Si le rendez-vous était prévu mais que la personne ne s'est pas présentée ou n'a pu être vue, cochez Non."
        values={["Oui", "Non"]}
        mode="toggle"
        dispatch={dispatch}
        state={state.honoredMeeting}
        invalid={!!errors.honoredMeeting}
      />
      {state.honoredMeeting && state.honoredMeeting.includes("Oui") && (
        <>
          <ActBlock
            type="examinationTypes"
            title="Type(s) d'acte"
            values={["Somatique"]}
            mode="toggleMultiple"
            dispatch={dispatch}
            state={state.examinationTypes || []}
            invalid={!!errors.examinationTypes}
          />
          <ActBlock
            type="examinations"
            title="Prélèvements et examens complémentaires"
            values={["Biologie", "Imagerie", "Autres"]}
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
            title="Lieu de l'examen (facultatif)"
            values={[
              "Unité d'accueil enfants en danger (UAPED)",
              "Maison des femmes/santé",
          { title: "Autre lieu", subValues: profileLocations },
            ]}
            mode="toggle"
            dispatch={dispatch}
            state={state.location || ""}
            invalid={!!errors.location}
          />
          <Title2 className="mt-5 mb-2">{personTitle}</Title2>

          <ActBlock
            type="personGender"
            title={personTitle}
            subTitle="Genre"
            values={["Féminin", "Masculin", "Autre genre", "Non déterminé"]}
            mode="toggle"
            dispatch={dispatch}
            state={state.personGender || ""}
            invalid={!!errors.personGender}
          />
          <ActBlock
            type="personAgeTag"
            title={personTitle}
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

const AsylumSeekerRead = (act) => {
  if (act.honoredMeeting === "Non")
    return (
      <>
        <Row>
          <Col className="mr-3">
            <ColumnAct header={"Statut"} content={act && act.profile} />
          </Col>
          <Col className="mr-3">
            <ColumnAct header={"Rendez-vous honoré"} content="Non" />
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
            <ColumnAct header={"Rendez-vous honoré"} content="Oui" />
          </Col>
          <Col className="mr-3">
            <ColumnAct header={"Type(s) d'acte"} content={act && act.examinationTypes} />
          </Col>
          <Col className="mr-3">
            <ColumnAct header={"Prélèvements et examens complémentaires"} content={act && act.examinations} />
          </Col>
          <Col className="mr-3" />
        </Row>

        <Title2 className="pt-3">Profil</Title2>

      <Row>
        <Col className="mr-3">
          <ColumnAct header={"Genre"} content={act && act.personGender} />
        </Col>
        <Col className="mr-3">
          <ColumnAct header={"Âge"} content={act && act.personAgeTag} />
        </Col>
        <Col className="mr-3">
          <ColumnAct header={"Lieu de l'examen"} content={act.location} />
        </Col>
        <Col className="mr-3" />
        <Col className="mr-3" />
      </Row>
    </>
  )
}

const hasErrors = (state) => {
  const errors = {}
  if (!state.honoredMeeting) {
    errors.honoredMeeting = "Obligatoire"
  }
  if (state.honoredMeeting === "Oui") {
    if (!state.examinationTypes?.length) {
      errors.examinationTypes = "Obligatoire"
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

AsylumSeekerEdit.propTypes = {
  dispatch: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  errors: PropTypes.object,
}
const AsylumSeeker = {
  edit: AsylumSeekerEdit,
  read: AsylumSeekerRead,
  hasErrors,
}

export default AsylumSeeker
