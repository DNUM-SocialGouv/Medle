import React, { useState, useEffect } from "react"
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
import AsyncSelect from "react-select/async"
import Select from "react-select"

import Layout from "../../../components/Layout"
import { Title1 } from "../../../components/StyledComponents"
import { isEmpty } from "../../../utils/misc"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../utils/auth"
import { availableRolesForUser, rulesOfRoles, ADMIN, ADMIN_HOSPITAL, ROLES_DESCRIPTION } from "../../../utils/roles"
import { logError, logDebug } from "../../../utils/logger"
import { searchHospitalsFuzzy } from "../../../clients/hospitals"
import { createUser, deleteUser, findUser, updateUser } from "../../../clients/users"

const MandatorySign = () => <span style={{ color: "red" }}>*</span>

const mapForSelect = (data, fnValue, fnLabel) => {
   if (!data) return null
   return { value: fnValue(data), label: fnLabel(data) }
}

const mapArrayForSelect = (data, fnValue, fnLabel) => {
   if (!data || !data.length) return null
   return data.map(curr => ({ value: fnValue(curr), label: fnLabel(curr) }))
}

// React component : only available for ADMIN or ADMIN_HOSPITAL
const UserDetail = ({ initialUser = {}, currentUser, error: initialError }) => {
   const router = useRouter()
   const { id } = router.query
   const { handleSubmit, register, errors: formErrors, setValue } = useForm({
      defaultValues: {
         id: initialUser.id,
         firstName: initialUser.firstName,
         lastName: initialUser.lastName,
         email: initialUser.email,
         role: initialUser.role,
         scope: initialUser.scope,
         hospital: initialUser.hospital || currentUser.hospital, // use ADMIN_HOSPITAL's hospital for creation
      },
   })

   // Special case due to react-select design : needs to store specifically the value of the select
   const [role, setRole] = useState(
      mapForSelect(
         initialUser && initialUser.role,
         elt => elt,
         elt => ROLES_DESCRIPTION[elt],
      ),
   )

   const initialUserHospitalSelect = mapForSelect(
      initialUser && initialUser.hospital,
      elt => elt.id,
      elt => elt.name,
   )

   const currentUserHospitalSelect = mapForSelect(
      currentUser.hospital,
      elt => elt.id,
      elt => elt.name,
   )

   // Get the hospital of initialUser for updates, but the one of currentUser for creates
   const [hospital, setHospital] = useState(
      initialUser && initialUser.hospital ? initialUserHospitalSelect : currentUserHospitalSelect,
   )

   const initialUserScopeSelect = mapArrayForSelect(
      initialUser && initialUser.scope,
      elt => elt.id,
      elt => elt.name,
   )

   const [scope, setScope] = useState(initialUserScopeSelect)

   // General error (alert)
   const [error, setError] = useState(initialError)
   // Fields errors, for those not managed by useForm
   const [errors, setErrors] = useState({})
   const [success, setsuccess] = useState("")
   const [modal, setModal] = useState(false)

   const toggle = () => setModal(!modal)

   const availableRoles = availableRolesForUser(currentUser)
   const roles = availableRoles.map(role => ({
      value: role,
      label: ROLES_DESCRIPTION[role],
   }))

   const customRulesAdminHospital =
      currentUser.role === ADMIN_HOSPITAL
         ? {
              hospitalDisabled: true,
              hospitalValue: mapForSelect(
                 currentUser.hospital,
                 elt => elt.id,
                 elt => elt.name,
              ),

              scopeDisabled: true,
           }
         : {}

   const customRuleOwnRecord = currentUser.id === initialUser.id ? { roleDisabled: true } : {}

   const rules = { ...rulesOfRoles(role && role.value), ...customRulesAdminHospital, ...customRuleOwnRecord }

   const onDeleteUser = () => {
      toggle()

      const del = async id => {
         try {
            const { deleted } = await deleteUser({ id })
            logDebug(`Nb deleted rows: ${deleted}`)
            router.push("/administration/users")
         } catch (error) {
            setError(error)
         }
      }

      del(id)
   }

   const onSubmit = async user => {
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
      if (rules.scopeRequired && (!scope || !scope.length)) {
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

   const onRoleChange = selectedOption => {
      // eslint-disable-next-line no-unused-vars
      setErrors(({ role, ...errors }) => ({ errors }))

      if (selectedOption && selectedOption.value) {
         // Reset the hospital & scope whenever the role changes
         const rules = rulesOfRoles(selectedOption.value)
         if (rules.hospitalDisabled) {
            onHospitalChange(null)
         } else {
            onHospitalChange(
               initialUser && initialUser.hospital ? initialUserHospitalSelect : currentUserHospitalSelect,
            )
         }

         if (rules.scopeDisabled) {
            onScopeChange(null)
         } else {
            onScopeChange(initialUser && initialUser.scope ? initialUserScopeSelect : null)
         }
      }

      // Needs transformation between format of react-select to expected format for API call
      setValue("role", (selectedOption && selectedOption.value) || null)

      // Needs to sync specifically the value to the react-select as well
      setRole(selectedOption)
   }

   const onHospitalChange = selectedOption => {
      // eslint-disable-next-line no-unused-vars
      setErrors(({ hospital, ...errors }) => ({ errors }))

      // Needs transformation between format of react-select to expected format for API call
      setValue(
         "hospital",
         selectedOption && selectedOption.value
            ? {
                 id: selectedOption.value,
                 name: selectedOption.label,
              }
            : null,
      )
      // Needs to sync specifically the value to the react-select as well
      setHospital(selectedOption)
   }

   const onScopeChange = selectedOption => {
      // eslint-disable-next-line no-unused-vars
      setErrors(({ scope, ...errors }) => ({ errors }))

      // Needs transformation between format of react-select to expected format for API call
      setValue(
         "scope",
         !selectedOption || !selectedOption.length
            ? null
            : selectedOption.map(curr => ({ id: curr.value, name: curr.label })),
      )
      // Needs to sync specifically the value to the react-select as well
      setScope(selectedOption)
   }

   useEffect(() => {
      // Extra field in form to store the value of selects
      register({ name: "role" })
      register({ name: "hospital" })
      register({ name: "scope" })
   }, [register])

   const customStyles = hasError => ({
      control: styles => ({
         ...styles,
         ...(hasError && { borderColor: "#d63626" }),
      }),
   })

   const searchHospitals = async search => {
      const hospitals = await searchHospitalsFuzzy({ search })

      return hospitals.map(hospital => ({
         value: hospital.id,
         label: hospital.name,
      }))
   }

   return (
      <Layout page="users" currentUser={currentUser} admin={true}>
         <Container style={{ maxWidth: 720 }} className="mt-5 mb-4">
            <Title1 className="mb-5">{"Utilisateur"}</Title1>

            {error && <Alert color="danger">{error}</Alert>}

            {success && <Alert color="success">{success}</Alert>}

            <Form onSubmit={handleSubmit(onSubmit)}>
               <FormGroup row>
                  <Label for="id" sm={3}>
                     Id
                  </Label>
                  <Col sm={9}>
                     <Input type="text" name="id" id="id" disabled innerRef={register} />
                  </Col>
               </FormGroup>
               <FormGroup row>
                  <Label for="firstName" sm={3}>
                     Prénom
                  </Label>
                  <Col sm={9}>
                     <Input type="text" name="firstName" id="firstName" innerRef={register} />
                  </Col>
               </FormGroup>
               <FormGroup row>
                  <Label for="lastName" sm={3}>
                     Nom&nbsp;
                     <MandatorySign />
                  </Label>
                  <Col sm={9}>
                     <Input
                        type="text"
                        name="lastName"
                        id="lastName"
                        invalid={!!formErrors.lastName}
                        innerRef={register({ required: true })}
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
                     <Input
                        type="text"
                        name="email"
                        id="email"
                        innerRef={register({
                           required: true,
                           pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                           },
                        })}
                        invalid={!!formErrors.email}
                     />
                     <FormFeedback>{formErrors.email && "Courriel a un format incorrect."}</FormFeedback>
                  </Col>
               </FormGroup>
               <FormGroup row>
                  <Label for="role" sm={3}>
                     Rôle&nbsp;
                     <MandatorySign />
                  </Label>
                  <Col sm={9}>
                     <Select
                        options={roles}
                        value={role}
                        onChange={onRoleChange}
                        noOptionsMessage={() => "Aucun résultat"}
                        placeholder="Choisissez un rôle"
                        isClearable={true}
                        isSearchable={true}
                        isDisabled={rules.roleDisabled}
                        styles={customStyles(errors.role)}
                     />
                     {errors.role && <FormFeedback className="d-block">{errors.role}</FormFeedback>}
                  </Col>
               </FormGroup>
               {!rules.hospitalDisabled && role && (
                  <FormGroup row>
                     <Label for="hospital" sm={3}>
                        {"Établissement d'appartenance"}&nbsp;
                        <MandatorySign />
                     </Label>
                     <Col sm={9}>
                        <AsyncSelect
                           loadOptions={searchHospitals}
                           value={hospital}
                           onChange={onHospitalChange}
                           noOptionsMessage={() => "Aucun résultat"}
                           loadingMessage={() => "Chargement..."}
                           placeholder="Choisissez un établissement"
                           isClearable={true}
                           isDisabled={rules.hospitalDisabled}
                           styles={customStyles(errors.hospital)}
                        />
                        {errors.hospital && <FormFeedback className="d-block">{errors.hospital}</FormFeedback>}
                     </Col>
                  </FormGroup>
               )}
               {!rules.scopeDisabled && role && (
                  <FormGroup row>
                     <Label for="scope" sm={3}>
                        Établissements visibles&nbsp;
                        <MandatorySign />
                     </Label>
                     <Col sm={9}>
                        <AsyncSelect
                           loadOptions={searchHospitals}
                           isMulti
                           value={scope}
                           onChange={onScopeChange}
                           noOptionsMessage={() => "Aucun résultat"}
                           loadingMessage={() => "Chargement..."}
                           placeholder="Choisissez un établissement"
                           isClearable={true}
                           isDisabled={rules.scopeDisabled}
                           styles={customStyles(errors.scope)}
                        />
                        {errors.scope && <FormFeedback className="d-block">{errors.scope}</FormFeedback>}
                     </Col>
                  </FormGroup>
               )}
               <div className="justify-content-center d-flex">
                  <Link href="/administration/users">
                     <Button className="px-4 mt-5 mr-3" outline color="primary">
                        Retour
                     </Button>
                  </Link>
                  <Button className="px-4 mt-5 " color="primary">
                     {isEmpty(initialUser) ? "Ajouter" : "Modifier"}
                  </Button>
               </div>
               {!isEmpty(initialUser) && (
                  <div style={{ border: "1px solid tomato" }} className="px-4 py-3 mt-5 rounded">
                     <Title1 className="mb-4">Zone dangereuse</Title1>
                     <div className="d-flex justify-content-between align-items-center">
                        Je souhaite supprimer cet utilisateur
                        <Button className="" color="danger" outline onClick={toggle}>
                           Supprimer
                        </Button>
                     </div>
                  </div>
               )}
            </Form>
            <div>
               <Modal isOpen={modal} toggle={toggle}>
                  <ModalHeader toggle={toggle}>Voulez-vous vraiment supprimer cet utilisateur?</ModalHeader>
                  <ModalBody>
                     Si vous supprimez cet utilisateur, il ne serait plus visible ni modifiable dans la liste des
                     utilisateurs. Merci de confirmer votre choix.
                  </ModalBody>
                  <ModalFooter>
                     <Button color="primary" onClick={onDeleteUser}>
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

UserDetail.getInitialProps = async ctx => {
   const headers = buildAuthHeaders(ctx)

   const { id } = ctx.query

   if (!id || isNaN(id)) return { initialUser: {} }

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
