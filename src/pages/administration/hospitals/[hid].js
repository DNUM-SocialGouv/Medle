import { yupResolver } from "@hookform/resolvers/yup"
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import Head from "next/head"
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
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap"
import * as yup from "yup"

import { createHospital, deleteHospital, findHospital, updateHospital } from "../../../clients/hospitals"
import Layout from "../../../components/Layout"
import { InputDarker, Title1, Title2 } from "../../../components/StyledComponents"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../utils/auth"
import { logDebug, logError } from "../../../utils/logger"
import { isEmpty } from "../../../utils/misc"
import { ADMIN } from "../../../utils/roles"

const MandatorySign = () => (
  <span style={{ color: "#EE0700" }} aria-hidden="true">
    *
  </span>
)

const schema = yup.object({
  finesseNumber: yup.string(),
  name: yup.string().required("Le nom est obligatoire."),
  addr1: yup.string(),
  addr2: yup.string(),
  town: yup.string().required("La ville est obligatoire."),
  depCode: yup
    .string()
    .required("Le département est obligatoire.")
    .matches(/^2A|2B|[0-9]{2,3}$/i, "Le département a un format incorrect."),
  postalCode: yup.string().matches(/^[0-9]{5}$/i, "Le code postal a un format incorrect."),
  etp: yup.object({
    doctors: yup.number().typeError("Le nombre d'ETP est incorrect."),
    secretaries: yup.number().typeError("Le nombre d'ETP est incorrect."),
    nursings: yup.number().typeError("Le nombre d'ETP est incorrect."),
    executives: yup.number().typeError("Le nombre d'ETP est incorrect."),
    ides: yup.number().typeError("Le nombre d'ETP est incorrect."),
    auditoriumAgents: yup.number().typeError("Le nombre d'ETP est incorrect."),
    others: yup.number().typeError("Le nombre d'ETP est incorrect."),
  }),
})

// TODO : vérifier que seul le super admin puisse accéder à cette page
const HospitalDetail = ({ hospital = {}, currentUser, error: initialError }) => {
  const router = useRouter()
  const { id } = hospital

  const {
    handleSubmit,
    register,
    formState: { errors: formErrors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      ...hospital,
    },
    resolver: yupResolver(schema),
  })

  const formId = watch("id")

  // General error (alert)
  const [error, setError] = useState(initialError)
  // Fields errors, for those not managed by useForm
  const [success, setsuccess] = useState("")
  const [modal, setModal] = useState(false)

  const toggle = () => setModal(!modal)

  React.useEffect(() => {
    if (formErrors) setsuccess("")
  }, [formErrors, setsuccess])

  const onDeleteHospital = () => {
    toggle()

    const del = async (id) => {
      try {
        const { deleted } = await deleteHospital({ id })
        logDebug(`Nb deleted rows: ${deleted}`)
        router.push("/administration/hospitals")
      } catch (error) {
        setError("Erreur serveur.")
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

  const { ref: idRef, ...idReg } = register("id")
  const { ref: finesseNumberRef, ...finesseNumberReg } = register("finesseNumber")
  const { ref: nameRef, ...nameReg } = register("name")
  const { ref: addr1Ref, ...addr1Reg } = register("addr1")
  const { ref: addr2Ref, ...addr2Reg } = register("addr2")
  const { ref: townRef, ...townReg } = register("town")
  const { ref: depCodeRef, ...depCodeReg } = register("depCode")
  const { ref: postalCodeRef, ...postalCodeReg } = register("postalCode")
  const { ref: canDoPostMortemRef, ...canDoPostMortemReg } = register("canDoPostMortem")

  return (
    <Layout page="hospitals" currentUser={currentUser} admin={true}>
      <Head>
        <title>{hospital?.id ? "Détails de l'hôpital " + hospital?.name : "Ajouter un hôpital"} - Medlé</title>
      </Head>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <div className="d-flex justify-content-between">
          <Link href="/administration/hospitals">
            <a style={{ color: "#376FE6" }}>
              <ArrowBackIosIcon width={30} style={{ width: 15 }} />
              Retour à la liste
            </a>
          </Link>
        </div>

        <Title1>{hospital?.id ? "Détails de l'hôpital " + hospital?.name : "Ajouter un hôpital"}</Title1>

        {id ? (
          <Link href="/administration/hospitals/[hid]/employments" as={`/administration/hospitals/${id}/employments`}>
            <Button outline color="primary">
              <a>Gérer les ETP de référence</a>
            </Button>
          </Link>
        ) : (
          <span />
        )}
      </Container>

      <Container style={{ maxWidth: 980, minWidth: 740 }}>
        {error && <Alert color="danger mt-4">{error}</Alert>}

        {success && (
          <Alert color="success" className="d-flex justify-content-between align-items-center mt-4">
            {success}&nbsp;
            <div>
              <Link href="/administration/hospitals">
                <Button className="mr-3" color="primary">
                  <a>Retour à la liste</a>
                </Button>
              </Link>
              <Link href="/administration/hospitals/[hid]" as={`/administration/hospitals/new`}>
                <Button color="primary">
                  <a>Ajouter</a>
                </Button>
              </Link>
            </div>
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)} className="mt-4" role="group" aria-label="Détails de l'hôpital">
          <p>
            <i>
              Les champs indiqués par un&nbsp;
              <span style={{ color: "#EE0700" }} aria-hidden="true">
                *
              </span>
              <span className="sr-only">astérisque rouge</span>&nbsp;sont obligatoires.
            </i>
          </p>
          <FormGroup row>
            <Label for="id" sm={3} aria-label="Identifiant">
              ID
            </Label>
            <Col sm={9}>
              <InputDarker type="text" id="id" readOnly {...idReg} innerRef={idRef} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="finesseNumber" sm={3}>
              N° Finess
            </Label>
            <Col sm={9}>
              <InputDarker
                type="text"
                id="finesseNumber"
                {...finesseNumberReg}
                innerRef={finesseNumberRef}
                aria-label="Numéro Finess"
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="name" sm={3}>
              Nom&nbsp;
              <MandatorySign />
            </Label>
            <Col sm={9}>
              <InputDarker
                type="text"
                id="name"
                {...nameReg}
                innerRef={nameRef}
                invalid={!!formErrors.name}
                aria-required="true"
              />
              <FormFeedback>{formErrors.name?.message}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="addr1" sm={3}>
              Adresse 1&nbsp;
            </Label>
            <Col sm={9}>
              <InputDarker type="text" id="addr1" {...addr1Reg} innerRef={addr1Ref} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="addr2" sm={3}>
              Adresse 2&nbsp;
            </Label>
            <Col sm={9}>
              <InputDarker type="text" id="addr2" {...addr2Reg} innerRef={addr2Ref} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="town" sm={3}>
              Ville&nbsp;
              <MandatorySign />
            </Label>
            <Col sm={9}>
              <InputDarker
                type="text"
                id="town"
                {...townReg}
                innerRef={townRef}
                invalid={!!formErrors.town}
                aria-required="true"
              />
              <FormFeedback>{formErrors.town?.message}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="depCode" sm={3}>
              Département&nbsp;
              <MandatorySign />
            </Label>
            <Col sm={9}>
              <InputDarker
                type="text"
                id="depCode"
                {...depCodeReg}
                innerRef={depCodeRef}
                invalid={!!formErrors.depCode}
                placeholder="Ex: 44 ou 971"
                aria-required="true"
              />
              <FormFeedback>{formErrors.depCode?.message}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="postalCode" sm={3}>
              Code postal&nbsp;
            </Label>
            <Col sm={9}>
              <InputDarker
                type="text"
                id="postalCode"
                {...postalCodeReg}
                innerRef={postalCodeRef}
                invalid={!!formErrors.postalCode}
                placeholder="Ex: 94300"
              />
              <FormFeedback>{formErrors.postalCode?.message}</FormFeedback>
            </Col>
          </FormGroup>

          <Title2 className="mt-4 mb-3">Paramètres actes</Title2>
          <FormGroup row>
            <Label for="canDoPostMortem" sm={3}>
              Autopsies autorisées&nbsp;?&nbsp;
              <MandatorySign />
            </Label>
            <Col sm={9}>
              <InputDarker
                type="checkbox"
                id="canDoPostMortem"
                {...canDoPostMortemReg}
                innerRef={canDoPostMortemRef}
                invalid={!!formErrors.canDoPostMortem}
                className="mt-3 ml-0"
                aria-required="true"
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
              {formId ? "Modifier" : "Ajouter"}
            </Button>
          </div>
          {formId && (
            <div style={{ border: "1px solid #EE0700" }} className="px-4 py-3 mt-5 rounded">
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

  const { hid } = ctx.query

  if (!hid || isNaN(hid)) return { hospital: {}, key: Number(new Date()) }

  try {
    const hospital = await findHospital({ id: hid, headers })

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
