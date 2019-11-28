import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import moment from "moment"
import { FORMAT_DATE } from "../../utils/constants"
import { withAuthSync } from "../../utils/auth"
import { API_URL, ACT_DETAIL_ENDPOINT, ACT_DELETE_ENDPOINT } from "../../config"
import fetch from "isomorphic-unfetch"
import Layout from "../../components/Layout"
import ColumnAct from "../../components/ColumnAct"
import { Title1, Title2 } from "../../components/StyledComponents"
import { isEmpty } from "../../utils/misc"
import { Button, Col, Row, Alert, Container, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from "reactstrap"
import EditOutlinedIcon from "@material-ui/icons/EditOutlined"
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined"
import AddIcon from "@material-ui/icons/Add"

const ActDetail = () => {
   const router = useRouter()
   const { id } = router.query

   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState(false)
   const [act, setAct] = useState()

   const [modal, setModal] = useState(false)
   const toggle = () => setModal(!modal)

   useEffect(() => {
      const fetchData = async id => {
         let json
         try {
            const res = await fetch(API_URL + ACT_DETAIL_ENDPOINT + "/" + id)
            json = await res.json()

            console.log("json", json)
            setAct(json.act)
         } catch (error) {
            console.error(error)
            setError(error)
         }
         setIsLoading(false)
      }

      if (id) {
         console.log("id", id)
         setIsLoading(true)
         setError(false)
         fetchData(id)
      }
   }, [id])

   const deleteAct = () => {
      toggle()

      const deleteAct = async id => {
         try {
            await fetch(API_URL + ACT_DELETE_ENDPOINT + "/" + id)
            await router.push("/actsList")
         } catch (error) {
            setError(error)
         }
      }

      deleteAct(id)
   }

   const addAct = async () => {
      const bonus = `?internalNumber=${act.internal_number}&pvNumber=${act.pv_number}`
      return router.push(`/actDeclaration${bonus}`)
   }

   return (
      <Layout>
         <Title1 className="mt-5 mb-5">{`Acte n° ${(act && act.internal_number) || ""}`}</Title1>

         <Container style={{ maxWidth: 780 }}>
            <div style={{ border: "1px solid rgba(151,151,151,0.13)", borderRadius: 10 }} className="px-2 py-2">
               <EditOutlinedIcon style={{ float: "right" }} className="mr-2 mt-3" />
               <Title2 className="mb-4 mt-3">{"Identification de l'acte"}</Title2>

               <Row>
                  <Col className="mr-3">
                     <ColumnAct header={"Numéro de PV"} values={act && act.pv_number} />
                  </Col>
                  <Col className="mr-3">
                     <ColumnAct header={"Demandeur"} values={act && act.asker} />
                  </Col>
                  <Col className="mr-3">
                     <ColumnAct
                        header={"Date"}
                        values={act && act.examination_date && moment(act.examination_date).format(FORMAT_DATE)}
                     />
                  </Col>
                  <Col className="mr-3">
                     <ColumnAct
                        header={"Créneau horaire"}
                        values={act && act.extra_data && act.extra_data.examinationDatePeriod}
                     />
                  </Col>
               </Row>
               <Row>
                  <Col className="mr-3">
                     <ColumnAct header={"Statut"} values={act && act.profile} />
                  </Col>
                  <Col className="mr-3">
                     <ColumnAct
                        header={"Type d'examen"}
                        values={act && act.extra_data && act.extra_data.examinationTypes}
                     />
                  </Col>
                  <Col className="mr-3">
                     <ColumnAct
                        header={"Cause de la violence"}
                        values={act && act.extra_data && act.extra_data.violenceTypes}
                     />
                  </Col>
                  <Col className="mr-3">
                     <ColumnAct header={"Examens complémentaires"} values={act && act.examination_date_period} />
                  </Col>
               </Row>

               <Title2 className="mb-4 mt-3">{"Profil de la personne"}</Title2>

               <Row>
                  <Col className="mr-3">
                     <ColumnAct header={"Genre"} values={act && act.extra_data && act.extra_data.personGender} />
                  </Col>
                  <Col className="mr-3">
                     <ColumnAct header={"Âge"} values={act && act.extra_data && act.extra_data.personAgeTag} />
                  </Col>
               </Row>
            </div>

            {isLoading && (
               <div style={{ width: 100 }} className="mx-auto mt-5 mb-3">
                  <Spinner color="primary">Loading...</Spinner>
               </div>
            )}

            {!isEmpty(error) && (
               <Alert color="danger" className="mt-5 mb-5">
                  {error.general || "Veuillez renseigner les éléments en rouge"}
               </Alert>
            )}
         </Container>

         <Container style={{ maxWidth: 780 }} className="mt-4">
            <Row>
               <Col>
                  <Button block outline color="danger" onClick={toggle}>
                     <DeleteForeverOutlinedIcon style={{ float: "left" }} />
                     {"Supprimer l'acte"}
                  </Button>{" "}
                  <div>
                     <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle}>Voulez-vous vraiment supprimer cet acte?</ModalHeader>
                        <ModalBody>
                           Si vous supprimez cet acte, il ne serait plus visible ni modifiable dans la liste des actes.
                           Merci de confirmer votre choix.
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
               <Col>
                  <Button block outline color="primary" onClick={addAct}>
                     <AddIcon style={{ float: "left" }} />
                     Ajouter acte lié au dossier
                  </Button>{" "}
               </Col>
            </Row>

            <div className="text-center mt-5">
               <Link href="/actsList">
                  <a>Retour à la liste des actes</a>
               </Link>
            </div>
         </Container>
      </Layout>
   )
}

export default withAuthSync(ActDetail)
