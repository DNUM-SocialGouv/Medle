import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Select from "react-select"
import AsyncSelect from "react-select/async"
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

import { searchHospitalsFuzzy } from "../../../clients/hospitals"
import { createUser, deleteUser, findUser, updateUser, resetUserPasswordByAdmin } from "../../../clients/users"
import Layout from "../../../components/Layout"
import { InputDarker, Title1 } from "../../../components/StyledComponents"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../utils/auth"
import { logDebug, logError } from "../../../utils/logger"
import { isEmpty } from "../../../utils/misc"
import { ADMIN, ADMIN_HOSPITAL, availableRolesForUser, ROLES_DESCRIPTION, rulesOfRoles } from "../../../utils/roles"
import { ariaLiveMessagesFR, mapArrayForSelect, mapForSelect, reactSelectCustomTheme } from "../../../utils/select"

const MandatorySign = () => (
  <span style={{ color: "#EE0700" }} aria-hidden="true">
    *
  </span>
)

// React component : only available for ADMIN or ADMIN_HOSPITAL
const UserDetail = ({ initialUser = {}, currentUser, error: initialError }) => {
  const router = useRouter()
  const { id } = router.query

  const {
    handleSubmit,
    register,
    formState: { errors: formErrors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      id: initialUser.id,
      firstName: initialUser.firstName,
      lastName: initialUser.lastName,
      email: initialUser.email,
      role: initialUser.role,
      scope: initialUser.scope,
      hospital: initialUser.hospital || currentUser?.hospital, // use ADMIN_HOSPITAL's hospital for creation
    },
  })

  const formId = watch("id")

  // Special case due to react-select design : needs to store specifically the value of the select
  const [role, setRole] = useState(
    mapForSelect(
      initialUser?.role,
      (elt) => elt,
      (elt) => ROLES_DESCRIPTION[elt],
    ),
  )

  const initialUserHospitalSelect = mapForSelect(
    initialUser?.hospital,
    (elt) => elt.id,
    (elt) => elt.name,
  )

  const currentUserHospitalSelect = mapForSelect(
    currentUser?.hospital,
    (elt) => elt.id,
    (elt) => elt.name,
  )

  // Get the hospital of initialUser for updates, but the one of currentUser for creates
  const [hospital, setHospital] = useState(
    initialUser?.hospital ? initialUserHospitalSelect : currentUserHospitalSelect,
  )

  const initialUserScopeSelect = mapArrayForSelect(
    initialUser?.scope,
    (elt) => elt.id,
    (elt) => elt.name,
  )

  const [scope, setScope] = useState(initialUserScopeSelect)

  // General error (alert)
  const [error, setError] = useState(initialError)
  // Fields errors, for those not managed by useForm
  const [errors, setErrors] = useState({})
  const [success, setsuccess] = useState("")
  const [modalResetPassword, setModalResetPassword] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)

  const toggleResetPassword = () => setModalResetPassword(!modalResetPassword)
  const toggleDelete = () => setModalDelete(!modalDelete)

  const availableRoles = availableRolesForUser(currentUser)
  const roles = availableRoles.map((role) => ({
    value: role,
    label: ROLES_DESCRIPTION[role],
  }))

  const customRulesAdminHospital =
    currentUser?.role === ADMIN_HOSPITAL
      ? {
          hospitalDisabled: true,
          hospitalValue: mapForSelect(
            currentUser.hospital,
            (elt) => elt.id,
            (elt) => elt.name,
          ),

          scopeDisabled: true,
        }
      : {}

  const customRuleOwnRecord = currentUser?.id === initialUser.id ? { roleDisabled: true } : {}

  const rules = { ...rulesOfRoles(role?.value), ...customRulesAdminHospital, ...customRuleOwnRecord }

  const onResetPasswordUser = () => {
    toggleResetPassword()

    const res = async (id) => {
      try {
        const res = await resetUserPasswordByAdmin({ id })
      } catch (error) {
        setError(error.message || "Erreur serveur.")
      }
    }

    res(id)
  }

  const onDeleteUser = () => {
    toggleDelete()

    const del = async (id) => {
      try {
        const { deleted } = await deleteUser({ id })
        logDebug(`Nb deleted rows: ${deleted}`)
        router.push("/administration/users")
      } catch (error) {
        setError(error.message || "Erreur serveur.")
      }
    }

    del(id)
  }

  const onSubmit = async (user) => {
    setError("")
    setErrors({})
    setsuccess("")

    let localErrors = {}
    if (!role) {
      localErrors = { ...localErrors, role: "Le rôle est obligatoire." }
    }
    if (rules.hospitalRequired && !hospital) {
      localErrors = { ...localErrors, hospital: "L'établissement est obligatoire." }
    }
    if (rules.scopeRequired && !scope?.length) {
      localErrors = { ...errors, scope: "Le périmètre est obligatoire." }
    }

    if (!isEmpty(localErrors)) {
      setErrors(localErrors)
      return
    }

    try {
      if (isEmpty(formErrors)) {
        if (user.id) {
          const { updated } = await updateUser({ user })
          logDebug(`Nb updated rows: ${updated}`)
          setsuccess("Utilisateur modifié.")
        } else {
          user.id = null
          const { id } = await createUser({ user })
          setValue("id", id || "")
          setsuccess("Utilisateur créé.")
        }
      }
    } catch (error) {
      setError(error.status === 406 ? "Adresse courriel déjà utilisé." : "Erreur serveur.")
    }
  }

  const onRoleChange = (selectedOption) => {
    // eslint-disable-next-line no-unused-vars
    setErrors(({ role, ...errors }) => ({ errors }))

    if (selectedOption?.value) {
      // Reset the hospital & scope whenever the role changes
      const rules = rulesOfRoles(selectedOption.value)
      if (rules.hospitalDisabled) {
        onHospitalChange(null)
      } else {
        onHospitalChange(initialUser?.hospital ? initialUserHospitalSelect : currentUserHospitalSelect)
      }

      if (rules.scopeDisabled) {
        onScopeChange(null)
      } else {
        onScopeChange(initialUser?.scope ?? null)
      }
    }

    // Needs transformation between format of react-select to expected format for API call
    setValue("role", selectedOption?.value ?? null)

    // Needs to sync specifically the value to the react-select as well
    setRole(selectedOption)
  }

  const onHospitalChange = (selectedOption) => {
    // eslint-disable-next-line no-unused-vars
    setErrors(({ hospital, ...errors }) => ({ errors }))

    // Needs transformation between format of react-select to expected format for API call
    setValue(
      "hospital",
      selectedOption?.value
        ? {
            id: selectedOption.value,
            name: selectedOption.label,
          }
        : null,
    )
    // Needs to sync specifically the value to the react-select as well
    setHospital(selectedOption)
  }

  const onScopeChange = (selectedOption) => {
    // eslint-disable-next-line no-unused-vars
    setErrors(({ scope, ...errors }) => ({ errors }))

    // Needs transformation between format of react-select to expected format for API call
    setValue(
      "scope",
      !selectedOption?.length ? null : selectedOption.map((curr) => ({ id: curr.value, name: curr.label })),
    )
    // Needs to sync specifically the value to the react-select as well
    setScope(selectedOption)
  }

  useEffect(() => {
    // Extra field in form to store the value of selects
    register("role")
    register("hospital")
    register("scope")
  }, [register])

  const customStyles = (hasError) => ({
    control: (styles) => ({ ...styles, borderColor: "#555C64", ...(hasError && { borderColor: "#d63626" }) }),
    placeholder: (styles) => ({ ...styles, color: "#555C64" }),
    indicatorSeparator: (styles) => ({ ...styles, backgroundColor: "#555C64" }),
    dropdownIndicator: (styles) => ({ ...styles, color: "#555C64" }),
    clearIndicator: (styles) => ({ ...styles, color: "#555C64" }),
  })

  const searchHospitals = async (search) => {
    const hospitals = await searchHospitalsFuzzy({ search })

    return mapArrayForSelect(
      hospitals,
      (elt) => elt.id,
      (elt) => elt.name,
    )
  }

  const { ref: idRef, ...idReg } = register("id")
  const { ref: firstNameRef, ...firstNameReg } = register("firstName")
  const { ref: lastNameRef, ...lastNameReg } = register("lastName", { required: true })
  const { ref: emailRef, ...emailReg } = register("email", {
    required: true,
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    },
  })

  return (
    <Layout page="users" currentUser={currentUser} admin={true}>
      <Head>
        <title>
          {initialUser?.id
            ? "Détails de l'utilisateur " + initialUser?.lastName + " " + initialUser?.firstName + " "
            : "Ajouter un utilisateur "}
          - Medlé
        </title>
      </Head>
      <Container style={{ maxWidth: 720 }} className="mt-5 mb-4">
        <div className="d-flex justify-content-between">
          <Link href="/administration/users">
            <a style={{ color: "#376FE6" }}>
              <ArrowBackIosIcon width={30} style={{ width: 15 }} />
              Retour à la liste
            </a>
          </Link>
          <Title1>
            {initialUser?.id
              ? "Détails de l'utilisateur " + initialUser?.lastName + " " + initialUser?.firstName
              : "Ajouter un utilisateur"}
          </Title1>
          <span>&nbsp;</span>
        </div>

        {error && <Alert color="danger mt-4">{error}</Alert>}

        {success && (
          <Alert color="success" className="d-flex justify-content-between align-items-center mt-4">
            {success}&nbsp;
            <div>
              <Link href="/administration/users">
                <Button className="mr-3" color="primary">
                  <a>Retour à la liste</a>
                </Button>
              </Link>
              <Link href="/administration/users/[id]" as={`/administration/users/new`}>
                <Button color="primary">
                  <a>Ajouter</a>
                </Button>
              </Link>
            </div>
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)} className="mt-4" role="group" aria-label="Détails de l'utilisateur">
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
            <Label for="firstName" sm={3}>
              Prénom
            </Label>
            <Col sm={9}>
              <InputDarker type="text" id="firstName" {...firstNameReg} innerRef={firstNameRef} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="lastName" sm={3}>
              Nom&nbsp;
              <MandatorySign />
            </Label>
            <Col sm={9}>
              <InputDarker
                type="text"
                id="lastName"
                {...lastNameReg}
                innerRef={lastNameRef}
                invalid={!!formErrors.lastName}
                aria-required="true"
              />
              <FormFeedback>{formErrors.lastName && "Le nom est obligatoire."}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="email" sm={3}>
              Courriel&nbsp;
              <MandatorySign />
            </Label>
            <Col sm={9}>
              <InputDarker
                type="text"
                id="email"
                {...emailReg}
                innerRef={emailRef}
                invalid={!!formErrors.email}
                aria-required="true"
              />
              <FormFeedback>{formErrors.email && "Courriel a un format incorrect."}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={3} id="roleLabel">
              Rôle&nbsp;
              <MandatorySign />
            </Label>
            <Col sm={9}>
              <Select
                id="role"
                options={roles}
                value={role}
                onChange={onRoleChange}
                noOptionsMessage={() => "Aucun résultat"}
                placeholder="Choisissez un rôle"
                isClearable={true}
                isSearchable={true}
                isDisabled={rules.roleDisabled}
                styles={customStyles(errors.role)}
                aria-labelledby="roleLabel"
                aria-required={true}
                ariaLiveMessages={ariaLiveMessagesFR}
                theme={reactSelectCustomTheme}
              />
              {errors.role && <FormFeedback className="d-block">{errors.role}</FormFeedback>}
            </Col>
          </FormGroup>
          {!rules.hospitalDisabled && role && (
            <FormGroup row>
              <Label id="hospitalLabel" sm={3}>
                {"Établissement d'appartenance"}&nbsp;
                <MandatorySign />
              </Label>
              <Col sm={9}>
                <AsyncSelect
                  id="hospital"
                  loadOptions={searchHospitals}
                  value={hospital}
                  onChange={onHospitalChange}
                  noOptionsMessage={() => "Aucun résultat"}
                  loadingMessage={() => "Chargement..."}
                  placeholder="Tapez les premières lettres"
                  isClearable={true}
                  isDisabled={rules.hospitalDisabled}
                  styles={customStyles(errors.hospital)}
                  aria-labelledby="hospitalLabel"
                  aria-required={true}
                  ariaLiveMessages={ariaLiveMessagesFR}
                  theme={reactSelectCustomTheme}
                />
                {errors.hospital && <FormFeedback className="d-block">{errors.hospital}</FormFeedback>}
              </Col>
            </FormGroup>
          )}
          {!rules.scopeDisabled && role && (
            <FormGroup row>
              <Label id="scopeLabel" sm={3}>
                Établissements visibles&nbsp;
                <MandatorySign />
              </Label>
              <Col sm={9}>
                <AsyncSelect
                  id="scope"
                  loadOptions={searchHospitals}
                  isMulti
                  value={scope}
                  onChange={onScopeChange}
                  noOptionsMessage={() => "Aucun résultat"}
                  loadingMessage={() => "Chargement..."}
                  placeholder="Tapez les premières lettres"
                  isClearable={true}
                  isDisabled={rules.scopeDisabled}
                  styles={customStyles(errors.scope)}
                  aria-labelledby="scopeLabel"
                  aria-required={true}
                  ariaLiveMessages={ariaLiveMessagesFR}
                />
                {errors.scope && <FormFeedback className="d-block">{errors.scope}</FormFeedback>}
              </Col>
            </FormGroup>
          )}
          <div className="justify-content-center d-flex">
            <Link href="/administration/users">
              <Button className="px-4 mt-3 mr-3" outline color="primary">
                Annuler
              </Button>
            </Link>
            <Button className="px-4 mt-3" color="primary">
              {formId ? "Modifier" : "Ajouter"}
            </Button>
          </div>
          {formId && (
            <div style={{ border: "1px solid #EE0700" }} className="px-4 pt-3 pb-4 mt-5 rounded">
              <Title1 className="mb-4 mt-2">Zone dangereuse</Title1>
              <div className="d-flex justify-content-between align-items-center">
                Je réinitialise le mot de passe de cet utilisateur
                  <Button color="warning" onClick={toggleResetPassword} style={{ minWidth: 150 }}>
                    Réinitialiser
                  </Button>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                Je supprime cet utilisateur
                <Button color="danger" outline onClick={toggleDelete} style={{ minWidth: 150 }}>
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </Form>
        <div>
          <Modal isOpen={modalResetPassword} toggle={toggleResetPassword}>
            <ModalHeader toggle={toggleResetPassword}>Voulez-vous vraiment réinitialiser le mot de passe de cet utilisateur?</ModalHeader>
            <ModalBody>
              Un lien de réinitialisation de mot de passe valable 1H sera envoyé à l'utilisateur par email.
              Merci de confirmer votre choix.
            </ModalBody>
            <ModalFooter>
              <Button color="primary" outline onClick={toggleResetPassword}>
                Annuler
              </Button>
              <Button color="danger" onClick={onResetPasswordUser}>
                Confirmer
              </Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={modalDelete} toggle={toggleDelete}>
            <ModalHeader toggle={toggleDelete}>Voulez-vous vraiment supprimer cet utilisateur?</ModalHeader>
            <ModalBody>
              Si vous supprimez cet utilisateur, il ne serait plus visible ni modifiable dans la liste des utilisateurs.
              Merci de confirmer votre choix.
            </ModalBody>
            <ModalFooter>
              <Button color="primary" outline onClick={toggleDelete}>
                Annuler
              </Button>
              <Button color="danger" onClick={onDeleteUser}>
                Supprimer
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </Container>
    </Layout>
  )
}

UserDetail.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)

  const { id } = ctx.query

  // Initialise key prop with a fresh new value, to make possible to have a new blank page
  // see https://kentcdodds.com/blog/understanding-reacts-key-prop
  if (!id || isNaN(id)) return { initialUser: {}, key: Number(new Date()) }

  try {
    const user = await findUser({ id, headers })
    return { initialUser: user }
  } catch (error) {
    logError(error)
    redirectIfUnauthorized(error, ctx)

    return { error: "Erreur serveur" }
  }
}

UserDetail.propTypes = {
  initialUser: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
  error: PropTypes.string,
}

export default withAuthentication(UserDetail, ADMIN)
