import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Alert, Button, Col, Input, Row, FormFeedback } from "reactstrap"
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import EditOutlinedIcon from "@material-ui/icons/Edit"

import { Label, AnchorButton } from "../components/StyledComponents"
import Badge from "../components/Badge"
import { isEmpty, pluralize } from "../utils/misc"
import { isAllowed, EMPLOYMENT_MANAGEMENT } from "../utils/roles"
import { logError } from "../utils/logger"

import { findEmployment, updateEmployment } from "../clients/employments"
import { searchReferenceForMonth } from "../clients/employments-references"

const makeLabel = (number) => (number ? `${number} ETP prévu${pluralize(number)}` : null)

export const hasErrors = (dataMonth) => {
  const errors = {}

  if (dataMonth.doctors && isNaN(dataMonth.doctors)) {
    errors.doctors = "Nombre requis"
  }
  if (dataMonth.secretaries && isNaN(dataMonth.secretaries)) {
    errors.secretaries = "Nombre requis"
  }
  if (dataMonth.nursings && isNaN(dataMonth.nursings)) {
    errors.nursings = "Nombre requis"
  }
  if (dataMonth.executives && isNaN(dataMonth.executives)) {
    errors.executives = "Nombre requis"
  }
  if (dataMonth.ides && isNaN(dataMonth.ides)) {
    errors.ides = "Nombre requis"
  }
  if (dataMonth.auditoriumAgents && isNaN(dataMonth.auditoriumAgents)) {
    errors.auditoriumAgents = "Nombre requis"
  }
  if (dataMonth.others && isNaN(dataMonth.others)) {
    errors.others = "Nombre requis"
  }

  return errors
}

const AccordionEmploymentsMonth = ({ monthName, month, year, hospitalId, readOnly, currentUser }) => {
  const [open, setOpen] = useState(false)
  const [readOnlyState, setReadOnlyState] = useState(readOnly)
  const [errors, setErrors] = useState()

  const [dataMonth, setDataMonth] = useState({})
  const [reference, setReference] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const json = await findEmployment({ hospitalId, year, month })

        const etpReference = await searchReferenceForMonth({
          hospitalId,
          year,
          month,
        })

        setDataMonth(json)
        setReference(etpReference?.reference)
      } catch (error) {
        logError(error)
        return { error: "Erreur serveur" }
      }
    }

    fetchData()
  }, [hospitalId, month, open, year])

  const handleChange = (event) => {
    event.preventDefault()

    setDataMonth({ ...dataMonth, [event.target.name]: event.target.value })
  }

  const toggleReadOnly = () => setReadOnlyState((state) => !state)

  const handleUpdate = async () => {
    setErrors({})
    const errors = hasErrors(dataMonth)

    if (!isEmpty(errors)) {
      setErrors({ ...errors, general: "Erreur de saisie" })
      return
    }
    try {
      await updateEmployment({ hospitalId, year, month, dataMonth })
      toggleReadOnly()
    } catch (error) {
      logError(error)
      setErrors({ general: "Erreur lors de la mise à jour des ETP" })
    }
  }

  return (
    <>
      <Button outline color="secondary" block className="pt-2 pb-2 pl-4 text-left" onClick={() => setOpen(!open)}>
        {monthName}
        {!open && <ArrowForwardIosIcon className="float-right" width={24} />}
        {open && <ExpandMoreIcon className="float-right" width={24} />}
      </Button>
      {open && (
        <div className="px-2">
          <div className="pt-3 pb-2 pr-2 text-right">
            {!isAllowed(currentUser?.role, EMPLOYMENT_MANAGEMENT) ? null : readOnlyState ? (
              <Button outline onClick={toggleReadOnly} className="border-0">
                <EditOutlinedIcon width={24} />
              </Button>
            ) : (
              <AnchorButton onClick={handleUpdate}>Enregistrer</AnchorButton>
            )}
          </div>

          {!isEmpty(errors) && <Alert color="danger">{errors.general || "Erreur serveur"}</Alert>}

          <Row>
            <Col className="mr-3">
              <Label htmlFor="doctors">Médecin</Label>
              <Input
                name="doctors"
                type="number"
                min={0}
                step="0.05"
                invalid={errors && !!errors.doctors}
                placeholder="Nombre d'ETP"
                value={dataMonth["doctors"] || ""}
                onChange={(event) => handleChange(event)}
                disabled={readOnlyState}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.doctors}</FormFeedback>

              <Badge value={makeLabel(reference?.doctors)}></Badge>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="secretaries">Secrétaire</Label>
              <Input
                name="secretaries"
                type="number"
                min={0}
                step="0.05"
                invalid={errors && !!errors.secretaries}
                placeholder="Nombre d'ETP"
                value={dataMonth["secretaries"] || ""}
                onChange={(event) => handleChange(event)}
                disabled={readOnlyState}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.secretaries}</FormFeedback>

              <Badge value={makeLabel(reference?.secretaries)}></Badge>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="nursings">Aide soignant.e</Label>
              <Input
                name="nursings"
                type="number"
                min={0}
                step="0.05"
                invalid={errors && !!errors.nursings}
                placeholder="Nombre d'ETP"
                value={dataMonth["nursings"] || ""}
                onChange={(event) => handleChange(event)}
                disabled={readOnlyState}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.nursings}</FormFeedback>

              <Badge value={makeLabel(reference?.nursings)}></Badge>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="executives">Cadre de santé</Label>
              <Input
                name="executives"
                type="number"
                min={0}
                step="0.05"
                invalid={errors && !!errors.executives}
                placeholder="Nombre d'ETP"
                value={dataMonth["executives"] || ""}
                onChange={(event) => handleChange(event)}
                disabled={readOnlyState}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.executives}</FormFeedback>

              <Badge value={makeLabel(reference?.executives)}></Badge>
            </Col>
          </Row>
          <Row className="mt-2 mb-5">
            <Col className="mr-3">
              <Label htmlFor="ides">IDE</Label>
              <Input
                name="ides"
                type="number"
                min={0}
                step="0.05"
                invalid={errors && !!errors.ides}
                placeholder="Nombre d'ETP"
                value={dataMonth["ides"] || ""}
                onChange={(event) => handleChange(event)}
                disabled={readOnlyState}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.ides}</FormFeedback>

              <Badge value={makeLabel(reference?.ides)}></Badge>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="auditoriumAgents">{"Agent d'amphi."}</Label>
              <Input
                name="auditoriumAgents"
                type="number"
                min={0}
                step="0.05"
                invalid={errors && !!errors.auditoriumAgents}
                placeholder="Nombre d'ETP"
                value={dataMonth["auditoriumAgents"] || ""}
                onChange={(event) => handleChange(event)}
                disabled={readOnlyState}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.auditoriumAgents}</FormFeedback>

              <Badge value={makeLabel(reference?.auditoriumAgents)}></Badge>
            </Col>
            <Col className="mr-3">
              <Label htmlFor="others">Autres</Label>
              <Input
                name="others"
                type="number"
                min={0}
                step="0.05"
                invalid={errors && !!errors.others}
                placeholder="Nombre d'ETP"
                value={dataMonth["others"] || ""}
                onChange={(event) => handleChange(event)}
                disabled={readOnlyState}
                autoComplete="off"
              />
              <FormFeedback>{errors && errors.others}</FormFeedback>

              <Badge value={makeLabel(reference?.others)}></Badge>
            </Col>
            <Col className="mr-3"></Col>
          </Row>
        </div>
      )}
    </>
  )
}

AccordionEmploymentsMonth.propTypes = {
  monthName: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  hospitalId: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
}

AccordionEmploymentsMonth.defaultProps = {
  readOnly: true,
}

export default AccordionEmploymentsMonth
