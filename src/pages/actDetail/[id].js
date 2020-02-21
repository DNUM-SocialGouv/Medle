import React, { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import PropTypes from "prop-types"
import moment from "moment"
import fetch from "isomorphic-unfetch"
import { Button, Col, Row, Alert, Container, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import EditOutlinedIcon from "@material-ui/icons/EditOutlined"
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined"

import { FORMAT_DATE } from "../../utils/date"
import { API_URL, ACT_DETAIL_ENDPOINT, ACT_DELETE_ENDPOINT } from "../../config"
import Layout from "../../components/Layout"
import ColumnAct from "../../components/ColumnAct"
import { Title1, Title2 } from "../../components/StyledComponents"
import { isEmpty } from "../../utils/misc"
import { handleAPIResponse } from "../../utils/errors"
import { buildOptionsFetch, redirectIfUnauthorized, withAuthentication } from "../../utils/auth"
import { isAllowed, ACT_CONSULTATION, ACT_MANAGEMENT } from "../../utils/roles"
import { logError } from "../../utils/logger"
import { profiles } from "../../utils/actsConstants"

const ActDetail = ({ initialAct, id, error, currentUser }) => {
   const router = useRouter()
   const [isError, setIsError] = useState(error)
   const [act, setAct] = useState(initialAct)

   const [modal, setModal] = useState(false)
   const toggle = () => setModal(!modal)

   const getProfiledRender = ({ profile, act }) => {
      return profiles[profile].read(act)
   }

   const deleteAct = () => {
      toggle()

      const deleteAct = async id => {
         try {
            await fetch(API_URL + ACT_DELETE_ENDPOINT + "/" + id)
            await router.push("/actsList")
         } catch (error) {
            logError(error)
            setIsError(error)
         }
      }

      deleteAct(id)
   }

   const editAct = id => {
      return router.push(`/actDeclaration?id=${id}`)
   }

   return (
      <Layout page="actsList" currentUser={currentUser}>
         <Title1 className="mt-5 mb-5">{`Acte n° ${(act && act.internalNumber) || ""}`}</Title1>

         <Container style={{ maxWidth: 780 }}>
            <div className="px-2 py-2">
               <Title2 className="mb-4 mt-3">{"Identification de l'acte"}</Title2>
               <Row>
                  <Col className="mr-3">
                     <ColumnAct header={"Numéro de PV"} content={act && act.pvNumber} />
                  </Col>{" "}
                  <Col className="mr-3">
                     <ColumnAct header={"Demandeur"} content={act && act.asker && act.asker.name} />
                  </Col>
                  <Col className="mr-3">
                     <ColumnAct
                        header={"Date"}
                        content={act && act.examinationDate && moment(act.examinationDate).format(FORMAT_DATE)}
                     />
                  </Col>
                  <Col className="mr-3">
                     {act && act.periodOfDay && <ColumnAct header={"Créneau horaire"} content={act.periodOfDay} />}
                  </Col>
               </Row>
               {getProfiledRender({ profile: act.profile, act })}
            </div>

            {!isEmpty(isError) && (
               <Alert color="danger" className="mt-5 mb-5">
                  {isError.general || "Erreur serveur"}
               </Alert>
            )}
         </Container>

         <Container style={{ maxWidth: 780 }} className="mt-4">
            {isAllowed(currentUser.role, ACT_MANAGEMENT) && (
               <Row>
                  <Col>
                     <Button block outline color="danger" onClick={toggle}>
                        <DeleteForeverOutlinedIcon width={24} />
                        {" Supprimer l'acte"}
                     </Button>{" "}
                  </Col>
                  <Col>
                     <Button block outline color="info" onClick={() => editAct(id)}>
                        <EditOutlinedIcon width={24} />
                        {" Modifier l'acte"}
                     </Button>{" "}
                     <div>
                        <Modal isOpen={modal} toggle={toggle}>
                           <ModalHeader toggle={toggle}>Voulez-vous vraiment supprimer cet acte?</ModalHeader>
                           <ModalBody>
                              Si vous supprimez cet acte, il ne serait plus visible ni modifiable dans la liste des
                              actes. Merci de confirmer votre choix.
                           </ModalBody>
                           <ModalFooter>
                              <Button color="primary" onClick={deleteAct}>
                                 Supprimer
                              </Button>{" "}
                              <Button color="secondary" onClick={toggle}>
                                 Annuler
                              </Button>
                           </ModalFooter>
                        </Modal>
                     </div>
                  </Col>
               </Row>
            )}
            <div className="text-center mt-5">
               <Link href="/actsList">
                  <a>Retour à la liste des actes</a>
               </Link>
            </div>
         </Container>
      </Layout>
   )
}

ActDetail.getInitialProps = async ctx => {
   const optionsFetch = buildOptionsFetch(ctx)

   const { id } = ctx.query

   let json
   try {
      const response = await fetch(API_URL + ACT_DETAIL_ENDPOINT + "/" + id, optionsFetch)
      json = await handleAPIResponse(response)
      return { initialAct: json, id }
   } catch (error) {
      logError(error)
      redirectIfUnauthorized(error, ctx)

      return { error: "Erreur serveur" }
   }
}

ActDetail.propTypes = {
   initialAct: PropTypes.object,
   id: PropTypes.string,
   error: PropTypes.string,
   currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(ActDetail, ACT_CONSULTATION)
