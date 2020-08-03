import React, { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import PropTypes from "prop-types"
import {
  Button,
  Col,
  Alert,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"
import { useForm } from "react-hook-form"
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"

import Layout from "../../../components/Layout"
import { Title1 } from "../../../components/StyledComponents"
import { isEmpty } from "../../../utils/misc"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../utils/auth"
import { ADMIN } from "../../../utils/roles"
import { logError, logDebug } from "../../../utils/logger"
import { createHospital, deleteHospital, findHospital, updateHospital } from "../../../clients/hospitals"

const MandatorySign = () => <span style={{ color: "red" }}>*</span>

// TODO : vérifier que seul le super admin puisse accéder à cette page
const HospitalDetail = ({ hospital = {}, currentUser, error: initialError }) => {
  const router = useRouter()
  const { id } = router.query
  const { handleSubmit, register, errors: formErrors, setValue } = useForm({
    defaultValues: {
      ...hospital,
    },
  })

  // General error (alert)
  const [error, setError] = useState(initialError)
  // Fields errors, for those not managed by useForm
  const [success, setsuccess] = useState("")
  const [modal, setModal] = useState(false)

  const toggle = () => setModal(!modal)

  const onDeleteHospital = () => {
    toggle()

    const del = async (id) => {
      try {
        const { deleted } = await deleteHospital({ id })
        logDebug(`Nb deleted rows: ${deleted}`)
        router.push("/administration/hospitals")
      } catch (error) {
        setError(error)
      }
    }

    del(id)
  }

  const onSubmit = async (hospital) => {
    setError("")
    setsuccess("")

    try {
      if (isEmpty(formErrors)) {
        if (hospital.id) {
          const { updated } = await updateHospital({ hospital })
          logDebug(`Nb updated rows: ${updated}`)
          setsuccess("Hôpital modifié.")
        } else {
          hospital.id = null
          const { id } = await createHospital({ hospital })
          setValue("id", id || "")
          setsuccess("Hôpital créé.")
        }
      }
    } catch (error) {
      setError("Erreur serveur.")
    }
  }

  return (
    <Layout page="hospitals" currentUser={currentUser} admin={true}>
      <Container style={{ maxWidth: 720 }} className="mt-5 mb-4">
        <div className="d-flex justify-content-between">
          <Link href="/administration/hospitals">
            <a>
              <ArrowBackIosIcon width={30} style={{ width: 15 }} />
              Retour
            </a>
          </Link>
          <Title1>{"Hôpital"}</Title1>
          <span>&nbsp;</span>
        </div>

        {error && <Alert color="danger mt-4">{error}</Alert>}

        {success && (
          <Alert color="success" className="d-flex justify-content-between align-items-center mt-4">
            {success}&nbsp;
            <div>
              <Link href="/administration/hospitals">
                <Button className="mr-3" outline color="success">
                  <a>Retour à la liste</a>
                </Button>
              </Link>
              <Link href="/administration/hospitals/[id]" as={`/administration/hospitals/new`}>
                <Button outline color="success">
                  <a>Ajouter</a>
                </Button>
              </Link>
            </div>
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <FormGroup row>
            <Label for="id" sm={3}>
              Id
            </Label>
            <Col sm={9}>
              <Input type="text" name="id" id="id" disabled innerRef={register} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="finesseNumber" sm={3}>
              N° Finess
            </Label>
            <Col sm={9}>
              <Input type="text" name="finesseNumber" id="finesseNumber" innerRef={register} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="name" sm={3}>
              Nom&nbsp;
              <MandatorySign />
            </Label>
            <Col sm={9}>
              <Input
                type="text"
                name="name"
                id="name"
                invalid={!!formErrors.name}
                innerRef={register({ required: true })}
              />
              <FormFeedback>{formErrors.name && "Le nom est obligatoire."}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="addr1" sm={3}>
              Adresse 1&nbsp;
            </Label>
            <Col sm={9}>
              <Input type="text" name="addr1" id="addr1" innerRef={register} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="addr2" sm={3}>
              Adresse 2&nbsp;
            </Label>
            <Col sm={9}>
              <Input type="text" name="addr2" id="addr2" innerRef={register} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="town" sm={3}>
              Ville&nbsp;
              <MandatorySign />
            </Label>
            <Col sm={9}>
              <Input
                type="text"
                name="town"
                id="town"
                invalid={!!formErrors.town}
                innerRef={register({ required: true })}
              />
              <FormFeedback>{formErrors.town && "La ville est obligatoire."}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="depCode" sm={3}>
              Département&nbsp;
              <MandatorySign />
            </Label>
            <Col sm={9}>
              <Input
                type="text"
                name="depCode"
                id="depCode"
                innerRef={register({
                  required: true,
                  pattern: {
                    value: /^[0-9]{2,3}$/i,
                  },
                })}
                invalid={!!formErrors.depCode}
              />
              <FormFeedback>{formErrors.depCode && "Le département a un format incorrect."}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="postalCode" sm={3}>
              Code postal&nbsp;
            </Label>
            <Col sm={9}>
              <Input
                type="text"
                name="postalCode"
                id="postalCode"
                innerRef={register({
                  pattern: {
                    value: /^[0-9]{5}$/i,
                  },
                })}
                invalid={!!formErrors.postalCode}
              />
              <FormFeedback>{formErrors.postalCode && "Le code postal a un format incorrect."}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="canDoPostMortem" sm={3}>
              Autopsies autorisées&nbsp;?&nbsp;
              <MandatorySign />
            </Label>
            <Col sm={9}>
              <Input
                type="checkbox"
                name="canDoPostMortem"
                id="canDoPostMortem"
                invalid={!!formErrors.canDoPostMortem}
                innerRef={register}
                className="mt-3 ml-0"
              />
            </Col>
          </FormGroup>

          <div className="justify-content-center d-flex">
            <Link href="/administration/hospitals">
              <Button className="px-4 mt-5 mr-3" outline color="primary">
                Annuler
              </Button>
            </Link>
            <Button className="px-4 mt-5 " color="primary">
              {isEmpty(hospital) ? "Ajouter" : "Modifier"}
            </Button>
          </div>
          {!isEmpty(hospital) && (
            <div style={{ border: "1px solid tomato" }} className="px-4 py-3 mt-5 rounded">
              <Title1 className="mb-4">Zone dangereuse</Title1>
              <div className="d-flex justify-content-between align-items-center">
                Je souhaite supprimer cet hôpital
                <Button className="" color="danger" outline onClick={toggle}>
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </Form>
        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Voulez-vous vraiment supprimer cet hôpital?</ModalHeader>
            <ModalBody>
              Si vous supprimez cet hôpital, il ne serait plus visible ni modifiable dans la liste des hôpitaux. Merci
              de confirmer votre choix.
            </ModalBody>
            <ModalFooter>
              <Button color="primary" outline onClick={toggle}>
                Annuler
              </Button>
              <Button color="danger" onClick={onDeleteHospital}>
                Supprimer
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </Container>
    </Layout>
  )
}

HospitalDetail.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)

  const { id } = ctx.query

  if (!id || isNaN(id)) return { hospital: {}, key: Number(new Date()) }

  try {
    const hospital = await findHospital({ id, headers })
    return { hospital }
  } catch (error) {
    logError(error)
    redirectIfUnauthorized(error, ctx)

    return { error: "Erreur serveur" }
  }
}

HospitalDetail.propTypes = {
  hospital: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
  error: PropTypes.string,
}

export default withAuthentication(HospitalDetail, ADMIN)
