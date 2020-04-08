import React, { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import PropTypes from "prop-types"
import fetch from "isomorphic-unfetch"
import { Alert, Button, Col, Container, Form, FormFeedback, FormGroup, Input, Label } from "reactstrap"
import { METHOD_PATCH } from "../../../../utils/http"
import { useForm } from "react-hook-form"

import { API_URL, RESET_PWD_ENDPOINT } from "../../../../config"
import Layout from "../../../../components/LayoutAdmin"
import { Title1 } from "../../../../components/StyledComponents"
import { handleAPIResponse } from "../../../../utils/errors"
import { withAuthentication } from "../../../../utils/auth"
import { ADMIN } from "../../../../utils/roles"
import { logError } from "../../../../utils/logger"
import { isEmpty } from "../../../../utils/misc"

const fetchPatch = async (id, password) => {
   try {
      const response = await fetch(`${API_URL}${RESET_PWD_ENDPOINT}`, {
         method: METHOD_PATCH,
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ id, password }),
      })
      const modified = await handleAPIResponse(response)
      return modified
   } catch (error) {
      logError(error)
   }
}

const UserReset = ({ currentUser }) => {
   const { handleSubmit, register, errors: formErrors, watch } = useForm()
   const [error, setError] = useState("")
   const [success, setsuccess] = useState("")
   const router = useRouter()
   const { id } = router.query

   const onSubmit = async data => {
      setError("")

      try {
         if (isEmpty(formErrors)) {
            await fetchPatch(id, data.firstValue)
            setsuccess("Mot de passe mis à jour.")
         }
      } catch (error) {
         setError("Erreur serveur")
      }
   }

   return (
      <Layout currentUser={currentUser}>
         <Container style={{ maxWidth: 720 }} className="mt-5 mb-4">
            <Title1 className="mb-5">{"Utilisateur"}</Title1>

            {error && <Alert color="danger">{error}</Alert>}

            {success && <Alert>{success}</Alert>}

            <Form onSubmit={handleSubmit(onSubmit)}>
               <FormGroup row>
                  <Label for="firstValue" sm={4}>
                     Mot de passe
                  </Label>
                  <Col sm={8}>
                     <Input
                        type="password"
                        name="firstValue"
                        id="firstValue"
                        innerRef={register({
                           required: true,
                           pattern: {
                              value: /^[a-zA-Z0-9]{8,30}$/,
                           },
                        })}
                        invalid={!!formErrors.firstValue}
                     />
                     <FormFeedback>
                        {formErrors.firstValue && "Mot de passe invalide (8 à 30 caractères avec lettres ou chiffres)."}
                     </FormFeedback>
                  </Col>
               </FormGroup>
               <FormGroup row>
                  <Label for="confirmedValue" sm={4}>
                     Confirmation mot de passe
                  </Label>
                  <Col sm={8}>
                     <Input
                        type="password"
                        name="confirmedValue"
                        id="confirmedValue"
                        innerRef={register({
                           required: true,
                           validate: value => {
                              return value === watch("firstValue")
                           },
                        })}
                        invalid={!!formErrors.confirmedValue}
                     />
                     <FormFeedback>
                        {formErrors.confirmedValue && "Les mots de passe ne correspondent pas."}
                     </FormFeedback>
                  </Col>
               </FormGroup>
               <div className="justify-content-center d-flex">
                  <Link href="/administration/users">
                     <Button className="px-4 mt-5 mr-3" outline color="primary">
                        Retour
                     </Button>
                  </Link>
                  <Button className="px-4 mt-5 " color="primary" onClick={handleSubmit(onSubmit)}>
                     Mettre à jour
                  </Button>
               </div>
            </Form>
         </Container>
      </Layout>
   )
}

UserReset.propTypes = {
   initialUser: PropTypes.object,
   currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(UserReset, ADMIN)
