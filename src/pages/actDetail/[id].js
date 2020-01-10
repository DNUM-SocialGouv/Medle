import React, { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import PropTypes from "prop-types"

import moment from "moment"
import { FORMAT_DATE } from "../../utils/constants"
import { withAuthentication } from "../../utils/auth"
import { API_URL, ACT_DETAIL_ENDPOINT, ACT_DELETE_ENDPOINT } from "../../config"
import fetch from "isomorphic-unfetch"
import Layout from "../../components/Layout"
import ColumnAct from "../../components/ColumnAct"
import { Title1, Title2 } from "../../components/StyledComponents"
import { isEmpty } from "../../utils/misc"
import { Button, Col, Row, Alert, Container, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import { VictimDetail } from "../../components/profiles/VictimProfile"
import { CustodyDetail } from "../../components/profiles/CustodyProfile"
import { DeceasedDetail } from "../../components/profiles/DeceasedProfile"
import { BoneAgeDetail } from "../../components/profiles/BoneAgeProfile"
import { AsylumSeekerDetail } from "../../components/profiles/AsylumSeekerProfile"
import { CriminalCourtDetail } from "../../components/profiles/CriminalCourtProfile"
import { ReconstitutionDetail } from "../../components/profiles/ReconstitutionProfile"
import { DrunkDetail } from "../../components/profiles/DrunkProfile"
import { RestrainedDetail } from "../../components/profiles/RestrainedProfile"
import { handleAPIResponse } from "../../utils/errors"

import EditOutlinedIcon from "@material-ui/icons/EditOutlined"
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined"
import { isAllowed, ACT_CONSULTATION, ACT_MANAGEMENT } from "../../utils/roles"

const ActDetail = ({ initialAct, id, error, currentUser }) => {
   const router = useRouter()
   const [isError, setIsError] = useState(error)
   const [act, setAct] = useState(initialAct)

   const [modal, setModal] = useState(false)
   const toggle = () => setModal(!modal)

   const deleteAct = () => {
      toggle()

      const deleteAct = async id => {
         try {
            await fetch(API_URL + ACT_DELETE_ENDPOINT + "/" + id)
            await router.push("/actsList")
         } catch (error) {
            console.error(error)
            setIsError(error)
         }
      }

      deleteAct(id)
   }

   // const addAct = async () => {
   //    const bonus = `?internalNumber=${act.internal_number}&pvNumber=${act.pv_number}`
   //    return router.push(`/actDeclaration${bonus}`)
   // }

   const editAct = id => {
      return router.push(`/actDeclaration?id=${id}`)
   }

   return (
      <Layout page="actsList" currentUser={currentUser}>
         <Title1 className="mt-5 mb-5">{`Acte n° ${(act && act.internalNumber) || ""}`}</Title1>

         <Container style={{ maxWidth: 780 }}>
            <div style={{ border: "1px solid rgba(151,151,151,0.13)", borderRadius: 10 }} className="px-2 py-2">
               {isAllowed(currentUser.role, ACT_MANAGEMENT) && (
                  <Button
                     outline
                     onClick={() => editAct(id)}
                     style={{ border: 0, float: "right", cursor: "pointer" }}
                     className="mr-2 mt-3"
                  >
                     <EditOutlinedIcon width={24} />
                  </Button>
               )}
               <Title2 className="mb-4 mt-3">{"Identification de l'acte"}</Title2>
               <Row>
                  <Col className="mr-3">
                     <ColumnAct header={"Numéro de PV"} values={act && act.pvNumber} />
                  </Col>{" "}
                  <Col className="mr-3">
                     <ColumnAct header={"Demandeur"} values={act && act.asker && act.asker.name} />
                  </Col>
                  <Col className="mr-3">
                     <ColumnAct
                        header={"Date"}
                        values={act && act.examinationDate && moment(act.examinationDate).format(FORMAT_DATE)}
                     />
                  </Col>
                  <Col className="mr-3">
                     {act && act.periodOfDay && <ColumnAct header={"Créneau horaire"} values={act.periodOfDay} />}
                  </Col>
               </Row>
               {act && act.profile === "Victime" && VictimDetail(act)}
               {act && act.profile === "Gardé.e à vue" && CustodyDetail(act)}
               {act && act.profile === "Personne décédée" && DeceasedDetail(act)}
               {act && act.profile === "Personne pour âge osseux" && BoneAgeDetail(act)}
               {act && act.profile === "Demandeuse d'asile (risque excision)" && AsylumSeekerDetail(act)}
               {act && act.profile === "Autre activité/Assises" && CriminalCourtDetail(act)}
               {act && act.profile === "Autre activité/Reconstitution" && ReconstitutionDetail(act)}
               {act && act.profile === "Autre activité/IPM" && DrunkDetail(act)}
               {act && act.profile === "Autre activité/Personne retenue" && RestrainedDetail(act)}
            </div>

            {!isEmpty(isError) && (
               <Alert color="danger" className="mt-5 mb-5">
                  {isError.general || "Erreur en base de données"}
               </Alert>
            )}
         </Container>

         <Container style={{ maxWidth: 780 }} className="mt-4">
            {isAllowed(currentUser.role, ACT_MANAGEMENT) && (
               <Row>
                  <Col>
                     <Button block outline color="danger" onClick={toggle}>
                        <DeleteForeverOutlinedIcon style={{ float: "left" }} width={24} />
                        {"Supprimer l'acte"}
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
                  {/* <Col>
                  <Button block outline color="primary" onClick={addAct}>
                     <AddIcon style={{ float: "left" }} />
                     Ajouter acte lié au dossier
                  </Button>{" "}
               </Col> */}
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

ActDetail.getInitialProps = async ({ query }) => {
   const { id } = query

   let json
   try {
      const response = await fetch(API_URL + ACT_DETAIL_ENDPOINT + "/" + id)
      json = await handleAPIResponse(response)
      return { initialAct: json, id }
   } catch (error) {
      console.error(error)
      return { error: "Erreur en base de données" }
   }
}

ActDetail.propTypes = {
   initialAct: PropTypes.object,
   id: PropTypes.string,
   error: PropTypes.string,
   currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(ActDetail, ACT_CONSULTATION)
