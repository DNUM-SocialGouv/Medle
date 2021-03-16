import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos"
import EditOutlinedIcon from "@material-ui/icons/Edit"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import WarningRoundedIcon from "@material-ui/icons/WarningRounded"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { Alert, Button, Col, Form, Input, Row } from "reactstrap"

import { findEmployment, updateEmployment } from "../clients/employments"
import { searchReferenceForMonth } from "../clients/employments-references"
import { AnchorButton, Label, ValidationButton } from "../components/StyledComponents"
import { useUser } from "../hooks/useUser"
import { extractMonthYear, NAME_MONTHS } from "../utils/date"
import { isEmpty, pluralize } from "../utils/misc"
import { EMPLOYMENT_MANAGEMENT, isAllowed } from "../utils/roles"
import Badge from "./Badge"

const makeLabel = (number) => (number ? `${number} ETP prévu${pluralize(number)}` : null)

const FormEmployment = ({ dataMonth, handleChange, reference, readOnly = false }) => {
  return (
    <>
      <Row>
        <Col className="mr-3">
          <Label htmlFor="doctors">Médecin</Label>
          <Input
            name="doctors"
            id="doctors"
            type="number"
            min={0}
            step="0.05"
            placeholder={!readOnly ? "ex: 2,1" : "non rempli"}
            value={dataMonth?.["doctors"] || ""}
            onChange={handleChange}
            disabled={readOnly}
            autoComplete="off"
          />

          <Badge value={makeLabel(reference?.doctors)} label={"reference.doctors"} />
        </Col>
        <Col className="mr-3">
          <Label htmlFor="secretaries">Secrétaire</Label>
          <Input
            name="secretaries"
            id="secretaries"
            type="number"
            min={0}
            step="0.05"
            placeholder={!readOnly ? "ex: 2,1" : "non rempli"}
            value={dataMonth?.["secretaries"] || ""}
            onChange={handleChange}
            disabled={readOnly}
            autoComplete="off"
          />
          <Badge value={makeLabel(reference?.secretaries)} label={"reference.secretaries"} />
        </Col>
        <Col className="mr-3">
          <Label htmlFor="nursings">Aide soignant.e</Label>
          <Input
            name="nursings"
            id="nursings"
            type="number"
            min={0}
            step="0.05"
            placeholder={!readOnly ? "ex: 2,1" : "non rempli"}
            value={dataMonth?.["nursings"] || ""}
            onChange={handleChange}
            disabled={readOnly}
            autoComplete="off"
          />

          <Badge value={makeLabel(reference?.nursings)} label={"reference.nursings"} />
        </Col>
        <Col className="mr-3">
          <Label htmlFor="executives">Cadre de santé</Label>
          <Input
            name="executives"
            id="executives"
            type="number"
            min={0}
            step="0.05"
            placeholder={!readOnly ? "ex: 2,1" : "non rempli"}
            value={dataMonth?.["executives"] || ""}
            onChange={handleChange}
            disabled={readOnly}
            autoComplete="off"
          />
          <Badge value={makeLabel(reference?.executives)} label={"reference.executives"} />
        </Col>
      </Row>
      <Row className="my-4">
        <Col className="mr-3">
          <Label htmlFor="ides">IDE</Label>
          <Input
            name="ides"
            id="ides"
            type="number"
            min={0}
            step="0.05"
            placeholder={!readOnly ? "ex: 2,1" : "non rempli"}
            value={dataMonth?.["ides"] || ""}
            onChange={handleChange}
            disabled={readOnly}
            autoComplete="off"
          />
          <Badge value={makeLabel(reference?.ides)} label={"reference.ides"} />
        </Col>
        <Col className="mr-3">
          <Label htmlFor="auditoriumAgents">{"Agent d'amphi."}</Label>
          <Input
            name="auditoriumAgents"
            id="auditoriumAgents"
            type="number"
            min={0}
            step="0.05"
            placeholder={!readOnly ? "ex: 2,1" : "non rempli"}
            value={dataMonth?.["auditoriumAgents"] || ""}
            onChange={handleChange}
            disabled={readOnly}
            autoComplete="off"
          />
          <Badge value={makeLabel(reference?.auditoriumAgents)} label={"reference.auditoriumAgents"} />
        </Col>
        <Col className="mr-3">
          <Label htmlFor="others">Autres</Label>
          <Input
            name="others"
            id="others"
            type="number"
            min={0}
            step="0.05"
            placeholder={!readOnly ? "ex: 2,1" : "non rempli"}
            value={dataMonth?.["others"] || ""}
            onChange={handleChange}
            disabled={readOnly}
            autoComplete="off"
          />
          <Badge value={makeLabel(reference?.others)} label={"reference.others"} />
        </Col>
        <Col className="mr-3" />
      </Row>
      <style jsx>{`
        :global(input:disabled) {
          border: 0;
          background-color: white !important;
          font-weight: 500;
        }
      `}</style>
    </>
  )
}

FormEmployment.propTypes = {
  dataMonth: PropTypes.object,
  handleChange: PropTypes.func,
  readOnly: PropTypes.bool,
  reference: PropTypes.object,
}

const composeMonthName = (month, year) => NAME_MONTHS[month] + " " + year

const Messages = ({ success, errors }) => (
  <>
    {success && <Alert color="primary">{success}</Alert>}

    {!isEmpty(errors) && <Alert color="danger">{errors.general || "Erreur serveur"}</Alert>}
  </>
)

Messages.propTypes = {
  errors: PropTypes.object,
  success: PropTypes.string,
}

// TODO: ajouter la vérification que la saisie n'est pas définitive (!isFinal, ...)
const isAllowedToWrite = ({ user, hospitalId }) =>
  isAllowed(user?.role, EMPLOYMENT_MANAGEMENT) && user?.hospital?.id === hospitalId

export const CurrentMonthEmployments = ({ month, year, hospitalId }) => {
  const currentUser = useUser()
  const { success, errors, handleChange, handleSubmit, dataMonth, reference } = useEmployments({
    hospitalId,
    month,
    year,
  })

  const isWritable = isAllowedToWrite({ hospitalId, user: currentUser })

  return (
    <Form onSubmit={handleSubmit}>
      <Messages success={success} errors={errors} />

      <FormEmployment dataMonth={dataMonth} handleChange={handleChange} reference={reference} readOnly={!isWritable} />

      {isWritable && (
        <div className="my-5 text-center">
          <ValidationButton color="primary" size="lg" className="center">
            Valider
          </ValidationButton>
        </div>
      )}
    </Form>
  )
}

export const PassedMonthEmployments = ({ month, year, hospitalId, readOnly = false }) => {
  const currentUser = useUser()

  const { year: currentYear } = extractMonthYear()

  const warningEnabled = year < currentYear

  const { success, errors, handleChange, handleSubmit, dataMonth, reference } = useEmployments({
    hospitalId,
    month,
    year,
  })

  const [open, setOpen] = useState(false)
  const isWritable = isAllowedToWrite({ hospitalId, user: currentUser })

  const [readOnlyState, setReadOnlyState] = useState(!isWritable || readOnly)

  const toggleReadOnly = () => setReadOnlyState((state) => !state)

  const monthName = composeMonthName(month, year)

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit(event)
        toggleReadOnly()
      }}
    >
      <Button outline color="secondary" block className="pt-2 pb-2 mb-2 pl-4 text-left" onClick={() => setOpen(!open)}>
        {monthName}
        <div className="float-right">
          {warningEnabled && isEmpty(dataMonth) && (
            <span className="mr-4">
              À compléter&nbsp;
              <WarningRoundedIcon width="24" className="align-top" />
            </span>
          )}
          {!open && <ArrowForwardIosIcon width={24} />}
          {open && <ExpandMoreIcon width={24} />}
        </div>
      </Button>
      {open && (
        <div className="px-2">
          <div className="py-2 pr-2 text-right">
            {!isWritable ? null : readOnlyState ? (
              <Button outline onClick={toggleReadOnly} className="border-0">
                Modifier <EditOutlinedIcon width={24} />
              </Button>
            ) : (
              <AnchorButton>Enregistrer</AnchorButton>
            )}
          </div>

          <Messages success={success} errors={errors} />

          <FormEmployment
            dataMonth={dataMonth}
            handleChange={handleChange}
            reference={reference}
            readOnly={readOnlyState}
          />
        </div>
      )}
    </Form>
  )
}

CurrentMonthEmployments.propTypes = {
  hospitalId: PropTypes.number.isRequired,
  month: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
}

PassedMonthEmployments.propTypes = { ...CurrentMonthEmployments.propTypes, readOnly: PropTypes.bool }

function useEmployments({ month, year, hospitalId }) {
  const [errors, setErrors] = useState()
  const [success, setSuccess] = useState("")

  const [dataMonth, setDataMonth] = useState({})
  const [reference, setReference] = useState({})

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuccess("")
    }, 2000)

    return () => {
      clearInterval(timeoutId)
    }
  }, [success, setSuccess])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const json = await findEmployment({ hospitalId, month, year })

        const etpReference = await searchReferenceForMonth({
          hospitalId,
          month,
          year,
        })

        setDataMonth(json)
        setReference(etpReference?.reference)
      } catch (error) {
        return { error: "Erreur serveur" }
      }
    }

    fetchData()
  }, [hospitalId, month, year])

  const handleChange = (event) => {
    event.preventDefault()

    setDataMonth({ ...dataMonth, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setErrors({})

    try {
      await updateEmployment({ dataMonth, hospitalId, month, year })
      setSuccess("Vos informations ont bien été enregistrées.")
    } catch (error) {
      setErrors({ general: "Erreur lors de la mise à jour des ETP" })
    }
  }

  return { dataMonth, errors, handleChange, handleSubmit, reference, success }
}
