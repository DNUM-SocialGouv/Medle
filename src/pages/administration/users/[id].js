import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import PropTypes from "prop-types"
import fetch from "isomorphic-unfetch"
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

import { API_URL, ADMIN_USERS_ENDPOINT, HOSPITALS_ENDPOINT } from "../../../config"
import Layout from "../../../components/LayoutAdmin"
import { Title1 } from "../../../components/StyledComponents"
import { isEmpty } from "../../../utils/misc"
import { handleAPIResponse } from "../../../utils/errors"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../utils/auth"
import { METHOD_DELETE, METHOD_POST, METHOD_PUT } from "../../../utils/http"
import { ADMIN, SUPER_ADMIN, ROLES, ROLES_DESCRIPTION } from "../../../utils/roles"
import { logError } from "../../../utils/logger"

const fetchHospitals = async value => {
   const bonus = value ? `?fuzzy=${value}` : ""

   try {
      const response = await fetch(`${API_URL}${HOSPITALS_ENDPOINT}${bonus}`)
      const hospitals = await handleAPIResponse(response)
      return isEmpty(hospitals) ? [] : hospitals
   } catch (error) {
      logError(error)
   }
}
const fetchUpdate = async user => {
   try {
      const response = await fetch(`${API_URL}${ADMIN_USERS_ENDPOINT}/${user.id}`, {
         method: METHOD_PUT,
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(user),
      })
      return await handleAPIResponse(response)
   } catch (error) {
      logError(error)
   }
}
// eslint-disable-next-line no-unused-vars
const fetchCreate = async ({ id, ...user }) => {
   try {
      const response = await fetch(`${API_URL}${ADMIN_USERS_ENDPOINT}`, {
         method: user.id ? METHOD_PUT : METHOD_POST,
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(user),
      })
      return await handleAPIResponse(response)
   } catch (error) {
      logError(error)
   }
}

const MandatorySign = () => <span style={{ color: "red" }}>*</span>

const UserDetail = ({ initialUser = {}, currentUser }) => {
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
      },
   })
   // Special case due to react-select design : needs to store specifically the value of the select
   const [hospital, setHospital] = useState({
      selectedOption:
         initialUser.hospital && initialUser.hospital.name
            ? { value: initialUser.hospital.id, label: initialUser.hospital.name }
            : { value: "", label: "" },
   })
   const [role, setRole] = useState({
      selectedOption: initialUser.role
         ? { value: initialUser.role, label: ROLES_DESCRIPTION[initialUser.role] }
         : { value: "", label: "" },
   })

   const [error, setError] = useState("")
   const [success, setsuccess] = useState("")
   const [modal, setModal] = useState(false)

   const toggle = () => setModal(!modal)

   const disabled = currentUser.role !== SUPER_ADMIN

   const deleteUser = () => {
      toggle()

      const deleteUser = async id => {
         try {
            await fetch(`${API_URL}${ADMIN_USERS_ENDPOINT}/${id}`, { method: METHOD_DELETE })
            router.push("/administration/users")
         } catch (error) {
            logError(error)
            setError(error)
         }
      }

      deleteUser(id)
   }

   const onSubmit = async data => {
      setError("")

      try {
         if (isEmpty(formErrors)) {
            if (data.id) {
               await fetchUpdate(data)
               setsuccess("Utilisateur modifié.")
            } else {
               const res = await fetchCreate(data)
               setValue("id", (res && res.id) || "")
               setsuccess("Utilisateur créé.")
            }
         }
      } catch (error) {
         setError("Erreur serveur")
      }
   }

   const onRoleChange = selectedOption => {
      selectedOption = selectedOption || { value: "", label: "" }

      // Needs transformation between format of react-select to expected format for API call
      setValue("role", selectedOption.value)

      // Needs to sync specifically the value to the react-select as well
      setRole(selectedOption)
   }

   const onHospitalChange = selectedOption => {
      selectedOption = selectedOption || { value: "", label: "" }

      // Needs transformation between format of react-select to expected format for API call
      setValue("hospital", {
         id: (selectedOption && selectedOption.value) || "",
         name: (selectedOption && selectedOption.label) || "",
      })
      // Needs to sync specifically the value to the react-select as well
      setHospital(selectedOption)
   }

   useEffect(() => {
      // Extra field in form to store the value of the selects
      register({ name: "role" })
      register({ name: "hospital" })
   }, [register])

   return (
      <Layout currentUser={currentUser}>
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
                     <Input type="text" name="lastName" id="lastName" innerRef={register} />
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
                        options={Object.keys(ROLES).map(role => ({ value: role, label: ROLES_DESCRIPTION[role] }))}
                        value={role.selectedOption}
                        onChange={onRoleChange}
                        noOptionsMessage={() => "Aucun résultat"}
                        placeholder="Choisissez un rôle"
                        isClearable={true}
                        isSearchable={true}
                     />
                  </Col>
               </FormGroup>
               <FormGroup row>
                  <Label for="hospital" sm={3}>
                     {"Établissement d'appartenance"}
                  </Label>
                  <Col sm={9}>
                     <AsyncSelect
                        loadOptions={fetchHospitals}
                        value={hospital.selectedOption}
                        onChange={onHospitalChange}
                        noOptionsMessage={() => "Aucun résultat"}
                        loadingMessage={() => "Chargement..."}
                        placeholder="Choisissez un établissement"
                        isClearable={true}
                        isDisabled={disabled}
                     />
                  </Col>
               </FormGroup>
               <FormGroup row>
                  <Label for="scope" sm={3}>
                     Établissements accessibles
                  </Label>
                  <Col sm={9}>
                     <Input type="text" name="scope" id="scope" innerRef={register} />
                  </Col>
               </FormGroup>
               <div className="justify-content-center d-flex">
                  <Button className="px-4 mt-5 mr-3" color="primary">
                     {isEmpty(initialUser) ? "Ajouter" : "Modifier"}
                  </Button>
                  <Link href="/administration/users">
                     <Button className="px-4 mt-5 " outline color="primary">
                        Retour
                     </Button>
                  </Link>
               </div>

               {!isEmpty(initialUser) && (
                  <div style={{ backgroundColor: "#f7d7d4" }} className="px-4 py-3 mt-5 rounded">
                     <Title1 className="mb-4">Zone dangereuse</Title1>
                     <div
                        style={{ color: "#7d2a21", borderColor: "#f4c7c2" }}
                        className="d-flex justify-content-between align-items-center"
                     >
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
                     <Button color="primary" onClick={deleteUser}>
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
   const authHeaders = buildAuthHeaders(ctx)

   const { id } = ctx.query

   if (!id) return { initialUser: {} }

   try {
      const response = await fetch(API_URL + ADMIN_USERS_ENDPOINT + "/" + id, { headers: authHeaders })
      const user = await handleAPIResponse(response)
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
}

export default withAuthentication(UserDetail, ADMIN)
