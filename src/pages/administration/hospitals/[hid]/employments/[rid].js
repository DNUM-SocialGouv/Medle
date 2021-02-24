import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import Link from "next/link"
import { useRouter } from "next/router"
import PropTypes from "prop-types"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap"

import {
  createReferences,
  deleteReference,
  findReference,
  updateReferences,
} from "../../../../../clients/employments-references"
import Layout from "../../../../../components/Layout"
import MonthPicker from "../../../../../components/MonthPicker"
import { Title1, Title2 } from "../../../../../components/StyledComponents"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../../../utils/auth"
import { NAME_MONTHS, now } from "../../../../../utils/date"
import { getReferenceData } from "../../../../../utils/init"
import { logDebug, logError } from "../../../../../utils/logger"
import { isEmpty } from "../../../../../utils/misc"
import { ADMIN } from "../../../../../utils/roles"

const genericError = (
  <div>
    Oups, il y a des erreurs.{" "}
    <span role="img" aria-hidden="true">
      😕
    </span>
  </div>
)
const alreadyPresentError = (
  <div>
    Il existe déjà des ETP de référence pour ce mois.{" "}
    <span role="img" aria-hidden="true">
      😬
    </span>
  </div>
)

const EmploymentsReferencesDetailPage = ({ data, currentUser }) => {
  const router = useRouter()
  const { hid } = router.query

  const [hospital] = getReferenceData("hospitals").filter((hospital) => hospital.id === Number(hid))

  const dateNow = now()
  const year = dateNow.year()
  const month = String(dateNow.month() + 1).padStart(2, "0")

  let defaultValues = {
    startMonth: data ? { year: data.year, month: data.month } : { year, month },
  }

  if (data?.reference) {
    defaultValues = { ...defaultValues, id: data?.id || null, reference: data.reference }
  }

  const { control, handleSubmit, register, errors: formErrors, setValue } = useForm({
    defaultValues,
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [modal, setModal] = useState(false)

  const toggle = () => setModal(!modal)

  const p = () => {
    toggle()

    const del = async () => {
      try {
        const { deleted } = await deleteReference({ hospitalId: hid, referencesId: data?.id })
        logDebug(`Nb deleted rows: ${deleted}`)

        router.push("/administration/hospitals/[hid]/employments", `/administration/hospitals/${hid}/employments`)
      } catch (error) {
        setError(genericError)
      }
    }

    del()
  }

  const onSubmit = async (formData) => {
    setSuccess("")
    setError("")

    try {
      if (isEmpty(formErrors)) {
        let payload = {
          hospitalId: hid,
          reference: JSON.stringify(formData.reference),
          year: formData.startMonth.year,
          month: formData.startMonth.month?.toString().padStart(2, "0"),
        }

        if (formData?.id) {
          payload = { id: formData?.id, ...payload }
          const { updated } = await updateReferences({ payload })
          logDebug(`Nb updated rows: ${updated}`)
          setSuccess("Références modifiées.")
        } else {
          formData.id = null
          const { id } = await createReferences({ payload })

          setValue("id", id || "")
          setSuccess("Références créés.")
        }
      }
    } catch (error) {
      logError(error)
      if (error.message.match(/Il existe déjà des ETP de référence/)) setError(alreadyPresentError)
      else setError(genericError)
    }
  }

  return (
    <Layout page="hospitals" currentUser={currentUser} admin={true}>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <div className="d-flex justify-content-between">
          <Link href="/administration/hospitals/[hid]/employments" as={`/administration/hospitals/${hid}/employments`}>
            <a>
              <ArrowBackIosIcon width={30} style={{ width: 15 }} />
              Retour
            </a>
          </Link>
        </div>

        <Title1>Hôpital {hospital?.name}</Title1>
        <span />
      </Container>

      <Container style={{ maxWidth: 980, minWidth: 740 }}>
        <Title2 className="mt-4 mb-3">Paramètres ETP</Title2>

        {error && <Alert color="danger mt-4">{error}</Alert>}

        {success && (
          <Alert color="success" className="d-flex justify-content-between align-items-center mt-4">
            {success}&nbsp;
            <div>
              <Link
                href="/administration/hospitals/[hid]/employments"
                as={`/administration/hospitals/${hid}/employments`}
              >
                <Button className="mr-3" outline color="success">
                  <a>Retour à la liste</a>
                </Button>
              </Link>
            </div>
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <FormGroup row>
            <Label for="others" sm={3}>
              {"Mois d'effet "}
            </Label>
            <Col sm={9}>
              <Controller as={MonthPicker} control={control} name="startMonth" />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="id" sm={3}>
              Id
            </Label>
            <Col sm={9}>
              <Input type="text" name="id" id="id" disabled innerRef={register} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="doctors" sm={3}>
              Médecins&nbsp;
            </Label>
            <Col sm={9}>
              <Input
                type="number"
                autoComplete="off"
                name="reference.doctors"
                id="doctors"
                innerRef={register}
                invalid={!!formErrors.etp?.doctors}
                min={0}
                defaultValue={0}
                step="0.05"
              />

              <FormFeedback>{formErrors.etp?.doctors?.message}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="secretaries" sm={3}>
              Secrétaires&nbsp;
            </Label>
            <Col sm={9}>
              <Input
                type="number"
                autoComplete="off"
                name="reference.secretaries"
                id="secretaries"
                innerRef={register}
                invalid={!!formErrors.etp?.secretaries}
                min={0}
                defaultValue={0}
                step="0.05"
              />
              <FormFeedback>{formErrors.etp?.secretaries?.message}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="nursings" sm={3}>
              Aide soignant.e&nbsp;
            </Label>
            <Col sm={9}>
              <Input
                type="number"
                autoComplete="off"
                name="reference.nursings"
                id="nursings"
                innerRef={register}
                invalid={!!formErrors.etp?.nursings}
                min={0}
                defaultValue={0}
                step="0.05"
              />
              <FormFeedback>{formErrors.etp?.nursings?.message}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="executives" sm={3}>
              Cadre de santé&nbsp;
            </Label>
            <Col sm={9}>
              <Input
                type="number"
                autoComplete="off"
                name="reference.executives"
                id="executives"
                innerRef={register}
                invalid={!!formErrors.etp?.executives}
                min={0}
                defaultValue={0}
                step="0.05"
              />
              <FormFeedback>{formErrors.etp?.executives?.message}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="ides" sm={3}>
              IDE&nbsp;
            </Label>
            <Col sm={9}>
              <Input
                type="number"
                autoComplete="off"
                name="reference.ides"
                id="ides"
                innerRef={register}
                invalid={!!formErrors.etp?.ides}
                min={0}
                defaultValue={0}
                step="0.05"
              />
              <FormFeedback>{formErrors.etp?.ides?.message}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="auditoriumAgents" sm={3}>
              {"Agent d'amphithéâtre"}&nbsp;
            </Label>
            <Col sm={9}>
              <Input
                type="number"
                autoComplete="off"
                name="reference.auditoriumAgents"
                id="auditoriumAgents"
                innerRef={register}
                invalid={!!formErrors.etp?.auditoriumAgents}
                min={0}
                defaultValue={0}
                step="0.05"
              />
              <FormFeedback>{formErrors.etp?.auditoriumAgents?.message}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="others" sm={3}>
              Autres&nbsp;
            </Label>
            <Col sm={9}>
              <Input
                type="number"
                autoComplete="off"
                name="reference.others"
                id="others"
                innerRef={register}
                invalid={!!formErrors.etp?.others}
                min={0}
                defaultValue={0}
                step="0.05"
              />
              <FormFeedback>{formErrors.etp?.others?.message}</FormFeedback>
            </Col>
          </FormGroup>

          <div className="justify-content-center d-flex">
            <Link
              href="/administration/hospitals/[hid]/employments"
              as={`/administration/hospitals/${hid}/employments`}
            >
              <Button className="px-4 mt-5 mr-3" outline color="primary">
                Annuler
              </Button>
            </Link>
            <Button className="px-4 mt-5 " color="primary">
              {!data?.id ? "Ajouter" : "Modifier"}
            </Button>
          </div>
          {!isEmpty(data?.id) && (
            <div style={{ border: "1px solid tomato" }} className="px-4 py-3 mt-5 rounded">
              <Title1 className="mb-4">Zone dangereuse</Title1>
              <div className="d-flex justify-content-between align-items-center">
                Je souhaite supprimer cet enregistrement
                <Button className="" color="danger" outline onClick={toggle}>
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </Form>
        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
              Voulez-vous supprimer les ETP de références pour le mois de {NAME_MONTHS[data?.month]}?
            </ModalHeader>
            <ModalBody>Cette action est irréversible.</ModalBody>

            <ModalFooter>
              <Button color="primary" outline onClick={toggle}>
                Annuler
              </Button>
              <Button color="danger" onClick={p}>
                Supprimer
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </Container>
    </Layout>
  )
}

EmploymentsReferencesDetailPage.propTypes = {
  currentUser: PropTypes.object,
  data: PropTypes.object,
}

EmploymentsReferencesDetailPage.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)

  const { hid, rid } = ctx.query

  if (rid === "new") return {}

  try {
    const data = await findReference({ hospitalId: hid, referencesId: rid, headers })
    return { data, key: Number(new Date()) }
  } catch (error) {
    logError("APP error", error)

    redirectIfUnauthorized(error, ctx)
  }
  return {}
}

export default withAuthentication(EmploymentsReferencesDetailPage, ADMIN)
