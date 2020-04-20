import React, { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import PropTypes from "prop-types"
import { Alert, Button, Col, Container, Form, FormFeedback, FormGroup, Input, Label } from "reactstrap"
import { useForm } from "react-hook-form"
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"

import Layout from "../../../../components/Layout"
import { Title1 } from "../../../../components/StyledComponents"
import { withAuthentication } from "../../../../utils/auth"
import { ADMIN } from "../../../../utils/roles"
import { isEmpty } from "../../../../utils/misc"
import { logDebug } from "../../../../utils/logger"
import { patchUser } from "../../../../clients/users"

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
            const { modified } = await patchUser({ id, password: data.firstValue })
            logDebug(`Nb modified rows: ${modified}`)
            setsuccess("Mot de passe mis à jour.")
         }
      } catch (error) {
         setError("Erreur serveur")
      }
   }

   return (
      <Layout currentUser={currentUser} admin={true}>
         <Container style={{ maxWidth: 720 }} className="mt-5 mb-4">
            <div className="d-flex justify-content-between">
               <Link href="/administration/users">
                  <a>
                     <ArrowBackIosIcon width={30} style={{ width: 15 }} />
                     Retour
                  </a>
               </Link>
               <Title1>{"Utilisateur"}</Title1>
               <span>&nbsp;</span>
            </div>

            {error && <Alert color="danger mt-4">{error}</Alert>}

            {success && (
               <Alert color="success" className="d-flex justify-content-between align-items-center mt-4">
                  {success}&nbsp;
                  <Link href="/administration/users">
                     <Button className="" outline color="success">
                        <a>Retour à la liste</a>
                     </Button>
                  </Link>
               </Alert>
            )}

            <Form onSubmit={handleSubmit(onSubmit)} className="mt-4">
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
                        Annuler
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
