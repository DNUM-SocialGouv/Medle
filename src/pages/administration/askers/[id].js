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
import { createAsker, deleteAsker, findAsker, updateAsker } from "../../../clients/askers"

const MandatorySign = () => <span style={{ color: "red" }}>*</span>

// TODO : vérifier que seul le super admin puisse accéder à cette page
const AskerDetail = ({ asker = {}, currentUser, error: initialError }) => {
  const router = useRouter()
  const { id } = router.query
  const { handleSubmit, register, errors: formErrors, setValue } = useForm({
    defaultValues: {
      ...asker,
    },
  })

  // General error (alert)
  const [error, setError] = useState(initialError)
  const [success, setsuccess] = useState("")
  const [modal, setModal] = useState(false)

  const toggle = () => setModal(!modal)

  const onDeleteAsker = () => {
    toggle()

    const del = async (id) => {
      try {
        const { deleted } = await deleteAsker({ id })
        logDebug(`Nb deleteAsker rows: ${deleted}`)
        router.push("/administration/askers")
      } catch (error) {
        setError(error)
      }
    }

    del(id)
  }

  const onSubmit = async (asker) => {
    setError("")
    setsuccess("")

    try {
      if (isEmpty(formErrors)) {
        if (asker.id) {
          const { updated } = await updateAsker({ asker })
          logDebug(`Nb updated rows: ${updated}`)
          setsuccess("Demandeur modifié.")
        } else {
          asker.id = null
          const { id } = await createAsker({ asker })
          setValue("id", id || "")
          setsuccess("Demandeur créé.")
        }
      }
    } catch (error) {
      setError(
        error.message === "Asker already present"
          ? "Ce demandeur existe déjà avec le même nom pour le même département."
          : "Erreur serveur."
      )
    }
  }

  return (
    <Layout page="askers" currentUser={currentUser} admin={true}>
      <Container style={{ maxWidth: 720 }} className="mt-5 mb-4">
        <div className="d-flex justify-content-between">
          <Link href="/administration/askers">
            <a>
              <ArrowBackIosIcon width={30} style={{ width: 15 }} />
              Retour
            </a>
          </Link>
          <Title1>{"Demandeur"}</Title1>
          <span>&nbsp;</span>
        </div>

        {error && <Alert color="danger mt-4">{error}</Alert>}

        {success && (
          <Alert color="success" className="d-flex justify-content-between align-items-center mt-4">
            {success}&nbsp;
            <Link href="/administration/askers">
              <Button className="" outline color="success">
                <a>Retour à la liste</a>
              </Button>
            </Link>
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
            <Label for="depCode" sm={3}>
              Département&nbsp;
            </Label>
            <Col sm={9}>
              <Input
                type="text"
                name="depCode"
                id="depCode"
                innerRef={register({
                  required: false,
                  pattern: {
                    value: /^[0-9]{2,3}$/i,
                  },
                })}
                invalid={!!formErrors.depCode}
              />
              <FormFeedback>{formErrors.depCode && "Le département a un format incorrect."}</FormFeedback>
            </Col>
          </FormGroup>

          <div className="justify-content-center d-flex">
            <Link href="/administration/askers">
              <Button className="px-4 mt-5 mr-3" outline color="primary">
                Annuler
              </Button>
            </Link>
            <Button className="px-4 mt-5 " color="primary">
              {isEmpty(asker) ? "Ajouter" : "Modifier"}
            </Button>
          </div>
          {!isEmpty(asker) && (
            <div style={{ border: "1px solid tomato" }} className="px-4 py-3 mt-5 rounded">
              <Title1 className="mb-4">Zone dangereuse</Title1>
              <div className="d-flex justify-content-between align-items-center">
                Je souhaite supprimer ce demandeur
                <Button className="" color="danger" outline onClick={toggle}>
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </Form>
        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Voulez-vous vraiment supprimer ce demandeur?</ModalHeader>
            <ModalBody>
              Si vous supprimez ce demandeur, il ne serait plus visible ni modifiable dans la liste des demandeurs.
              Merci de confirmer votre choix.
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={onDeleteAsker}>
                Supprimer
              </Button>{" "}
              <Button color="secondary" onClick={toggle}>
                Annuler
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </Container>
    </Layout>
  )
}

AskerDetail.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)

  const { id } = ctx.query

  if (!id || isNaN(id)) return { asker: {} }

  try {
    const asker = await findAsker({ id, headers })
    return { asker }
  } catch (error) {
    logError(error)
    redirectIfUnauthorized(error, ctx)

    return { error: "Erreur serveur" }
  }
}

AskerDetail.propTypes = {
  asker: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
  error: PropTypes.string,
}

export default withAuthentication(AskerDetail, ADMIN)
