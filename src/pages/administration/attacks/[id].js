import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import Link from "next/link"
import { useRouter } from "next/router"
import PropTypes from "prop-types"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
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

import { createAttack, deleteAttack, findAttack, updateAttack } from "../../../clients/attacks"
import Layout from "../../../components/Layout"
import { Title1 } from "../../../components/StyledComponents"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../utils/auth"
import { logDebug, logError } from "../../../utils/logger"
import { isEmpty } from "../../../utils/misc"
import { ADMIN } from "../../../utils/roles"

const MandatorySign = () => <span style={{ color: "red" }}>*</span>

// TODO : vérifier que seul le super admin puisse accéder à cette page
const AttackDetail = ({ attack = {}, currentUser, error: initialError }) => {
  const router = useRouter()
  const { id } = router.query
  const {
    handleSubmit,
    register,
    formState: { errors: formErrors },
    setValue,
  } = useForm({
    defaultValues: {
      ...attack,
    },
  })

  // General error (alert)
  const [error, setError] = useState(initialError)
  const [success, setsuccess] = useState("")
  const [modal, setModal] = useState(false)

  const toggle = () => setModal(!modal)

  const onDeleteAttack = () => {
    toggle()

    const del = async (id) => {
      try {
        const { deleted } = await deleteAttack({ id })
        logDebug(`Nb deleteAttack rows: ${deleted}`)
        router.push("/administration/attacks")
      } catch (error) {
        setError("Erreur serveur.")
      }
    }

    del(id)
  }

  const onSubmit = async (attack) => {
    setError("")
    setsuccess("")

    try {
      if (isEmpty(formErrors)) {
        if (attack.id) {
          const { updated } = await updateAttack({ attack })
          logDebug(`Nb updated rows: ${updated}`)
          setsuccess("Attentat modifié.")
        } else {
          attack.id = null
          const { id } = await createAttack({ attack })
          setValue("id", id || "")
          setsuccess("Attentat créé.")
        }
      }
    } catch (error) {
      setError(
        error.message === "Attack already present" ? "Cet attentat existe déjà avec le même nom." : "Erreur serveur.",
      )
    }
  }

  const { ref: idRef, ...idReg } = register("id")
  const { ref: yearRef, ...yearReg } = register("year", {
    required: true,
    pattern: {
      value: /^(20[0-9]{2})|(19[8-9][0-9])$/i,
    },
  })
  const { ref: nameRef, ...nameReg } = register("name", {
    required: true,
  })

  return (
    <Layout page="attacks" currentUser={currentUser} admin={true}>
      <Container style={{ maxWidth: 720 }} className="mt-5 mb-4">
        <div className="d-flex justify-content-between">
          <Link href="/administration/attacks">
            <a>
              <ArrowBackIosIcon width={30} style={{ width: 15 }} />
              Retour
            </a>
          </Link>
          <Title1>{"Attentat"}</Title1>
          <span>&nbsp;</span>
        </div>

        {error && <Alert color="danger mt-4">{error}</Alert>}

        {success && (
          <Alert color="success" className="d-flex justify-content-between align-items-center mt-4">
            {success}&nbsp;
            <div>
              <Link href="/administration/attacks">
                <Button className="mr-3" outline color="success">
                  <a>Retour à la liste</a>
                </Button>
              </Link>
              <Link href="/administration/attacks/[id]" as={`/administration/attacks/new`}>
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
              <Input type="text" id="id" readOnly {...idReg} innerRef={idRef} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="year" sm={3}>
              Année&nbsp;
              <MandatorySign />
            </Label>
            <Col sm={9}>
              <Input type="text" id="year" {...yearReg} innerRef={yearRef} invalid={!!formErrors.year} />
              <FormFeedback>{formErrors.year && "L'année a un format incorrect."}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="name" sm={3}>
              Nom&nbsp;
              <MandatorySign />
            </Label>
            <Col sm={9}>
              <Input type="text" id="name" {...nameReg} innerRef={nameRef} invalid={!!formErrors.name} />
              <FormFeedback>{formErrors.name && "Le nom est obligatoire."}</FormFeedback>
            </Col>
          </FormGroup>
          <div className="justify-content-center d-flex">
            <Link href="/administration/attacks">
              <Button className="px-4 mt-5 mr-3" outline color="primary">
                Annuler
              </Button>
            </Link>
            <Button className="px-4 mt-5 " color="primary">
              {isEmpty(attack) ? "Ajouter" : "Modifier"}
            </Button>
          </div>
          {!isEmpty(attack) && (
            <div style={{ border: "1px solid tomato" }} className="px-4 py-3 mt-5 rounded">
              <Title1 className="mb-4">Zone dangereuse</Title1>
              <div className="d-flex justify-content-between align-items-center">
                Je souhaite supprimer cet attentat
                <Button className="" color="danger" outline onClick={toggle}>
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </Form>
        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Voulez-vous vraiment supprimer cet attentat?</ModalHeader>
            <ModalBody>
              Si vous supprimez cet attentat, il ne sera plus visible ni modifiable dans la liste des attentats. Merci
              de confirmer votre choix.
            </ModalBody>
            <ModalFooter>
              <Button color="primary" outline onClick={toggle}>
                Annuler
              </Button>
              <Button color="danger" onClick={onDeleteAttack}>
                Supprimer
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </Container>
    </Layout>
  )
}

AttackDetail.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)

  const { id } = ctx.query

  if (!id || isNaN(id)) return { attack: {}, key: Number(new Date()) }

  try {
    const attack = await findAttack({ id, headers })
    return { attack }
  } catch (error) {
    logError(error)
    redirectIfUnauthorized(error, ctx)

    return { error: "Erreur serveur" }
  }
}

AttackDetail.propTypes = {
  attack: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
  error: PropTypes.string,
}

export default withAuthentication(AttackDetail, ADMIN)
