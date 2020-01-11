import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Alert, Button, Col, Input, Row, FormFeedback } from "reactstrap"
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import EditOutlinedIcon from "@material-ui/icons/Edit"
import fetch from "isomorphic-unfetch"

import { Label, AnchorButton } from "../components/StyledComponents"
import { API_URL, EMPLOYMENTS_ENDPOINT } from "../config"
import { isEmpty } from "../utils/misc"
import { handleAPIResponse } from "../utils/errors"
import { isAllowed, EMPLOYMENT_MANAGEMENT } from "../utils/roles"

export const hasErrors = dataMonth => {
   const errors = {}

   if (dataMonth.doctors && isNaN(dataMonth.doctors)) {
      errors.doctors = "Nombre requis"
   }
   if (dataMonth.secretaries && isNaN(dataMonth.secretaries)) {
      errors.secretaries = "Nombre requis"
   }
   if (dataMonth.nursings && isNaN(dataMonth.nursings)) {
      errors.nursings = "Nombre requis"
   }
   if (dataMonth.executives && isNaN(dataMonth.executives)) {
      errors.executives = "Nombre requis"
   }
   if (dataMonth.ides && isNaN(dataMonth.ides)) {
      errors.ides = "Nombre requis"
   }
   if (dataMonth.auditoriumAgents && isNaN(dataMonth.auditoriumAgents)) {
      errors.auditoriumAgents = "Nombre requis"
   }
   if (dataMonth.psychologists && isNaN(dataMonth.psychologists)) {
      errors.psychologists = "Nombre requis"
   }
   if (dataMonth.others && isNaN(dataMonth.others)) {
      errors.others = "Nombre requis"
   }

   return errors
}

export const fetchDataMonth = async ({ hospitalId, year, month, optionsFetch }) => {
   const response = await fetch(API_URL + EMPLOYMENTS_ENDPOINT + `/${hospitalId}/${year}/${month}`, optionsFetch)
   return handleAPIResponse(response)
}

export const updateDataMonth = async ({ hospitalId, year, month, dataMonth }) => {
   const response = await fetch(API_URL + EMPLOYMENTS_ENDPOINT + `/${hospitalId}/${year}/${month}`, {
      method: "PUT",
      body: JSON.stringify(dataMonth),
   })
   await handleAPIResponse(response)
}

const AccordionEmploymentsMonth = ({ monthName, month, year, hospitalId, readOnly, currentUser }) => {
   const [open, setOpen] = useState(false)
   const [readOnlyState, setReadOnlyState] = useState(readOnly)
   const [errors, setErrors] = useState()

   const [dataMonth, setDataMonth] = useState({})

   useEffect(() => {
      const fetchData = async () => {
         let json

         try {
            json = await fetchDataMonth({ hospitalId, year, month })
         } catch (error) {
            console.error(error)
            return { error: "Erreur en base de données" }
         } finally {
            setDataMonth(json || [])
         }
      }

      fetchData()
   }, [hospitalId, month, open, year])

   const handleChange = event => {
      event.preventDefault()

      setDataMonth({ ...dataMonth, [event.target.name]: event.target.value })
   }

   const toggleReadOnly = () => setReadOnlyState(state => !state)

   const handleUpdate = async () => {
      setErrors({})
      const errors = hasErrors(dataMonth)

      if (!isEmpty(errors)) {
         setErrors({ ...errors, general: "Erreur de saisie" })
         return
      }
      try {
         await updateDataMonth({ hospitalId, year, month, dataMonth })
         toggleReadOnly()
      } catch (error) {
         console.error(error)
         setErrors({ general: "Erreur lors de la mise à jour des ETP" })
      }
   }

   return (
      <>
         <Button outline color="secondary" block className="text-left pl-4 pt-2 pb-2" onClick={() => setOpen(!open)}>
            {monthName}
            {!open && <ArrowForwardIosIcon className="float-right" width={24} />}
            {open && <ExpandMoreIcon className="float-right" width={24} />}
         </Button>
         {open && (
            <div className="px-2">
               <div className="text-right pr-2 pt-3 pb-2">
                  {!isAllowed(currentUser.role, EMPLOYMENT_MANAGEMENT) ? null : readOnlyState ? (
                     <Button outline onClick={toggleReadOnly} style={{ border: 0 }}>
                        <EditOutlinedIcon width={24} />
                     </Button>
                  ) : (
                     <AnchorButton onClick={handleUpdate}>Enregistrer</AnchorButton>
                  )}
               </div>

               {!isEmpty(errors) && <Alert color="danger">{errors.general || "Erreur en base de données"}</Alert>}

               <Row>
                  <Col className="mr-3">
                     <Label htmlFor="doctors">Médecin</Label>
                     <Input
                        name="doctors"
                        invalid={errors && !!errors.doctors}
                        placeholder="Nombre d'ETP"
                        value={dataMonth["doctors"] || ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                        autoComplete="off"
                     />
                     <FormFeedback>{errors && errors.doctors}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="secretaries">Secrétaire</Label>
                     <Input
                        name="secretaries"
                        invalid={errors && !!errors.secretaries}
                        placeholder="Nombre d'ETP"
                        value={dataMonth["secretaries"] || ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                        autoComplete="off"
                     />
                     <FormFeedback>{errors && errors.secretaries}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="nursings">Aide soignant.e</Label>
                     <Input
                        name="nursings"
                        invalid={errors && !!errors.nursings}
                        placeholder="Nombre d'ETP"
                        value={dataMonth["nursings"] || ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                        autoComplete="off"
                     />
                     <FormFeedback>{errors && errors.nursings}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="executives">Cadre de santé</Label>
                     <Input
                        name="executives"
                        invalid={errors && !!errors.executives}
                        placeholder="Nombre d'ETP"
                        value={dataMonth["executives"] || ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                        autoComplete="off"
                     />
                     <FormFeedback>{errors && errors.executives}</FormFeedback>
                  </Col>
               </Row>
               <Row className="mt-2 mb-5">
                  <Col className="mr-3">
                     <Label htmlFor="idesNumber">IDE</Label>
                     <Input
                        name="idesNumber"
                        invalid={errors && !!errors.idesNumber}
                        placeholder="Nombre d'ETP"
                        value={dataMonth["idesNumber"] || ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                        autoComplete="off"
                     />
                     <FormFeedback>{errors && errors.idesNumber}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="auditoriumAgents">{"Agent d'amphithéâtre"}</Label>
                     <Input
                        name="auditoriumAgents"
                        invalid={errors && !!errors.auditoriumAgents}
                        placeholder="Nombre d'ETP"
                        value={dataMonth["auditoriumAgents"] || ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                        autoComplete="off"
                     />
                     <FormFeedback>{errors && errors.auditoriumAgents}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="psychologists">Psychologue</Label>
                     <Input
                        name="psychologists"
                        invalid={errors && !!errors.psychologists}
                        placeholder="Nombre d'ETP"
                        value={dataMonth["psychologists"] || ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                        autoComplete="off"
                     />
                     <FormFeedback>{errors && errors.psychologists}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="others">Autres</Label>
                     <Input
                        name="others"
                        invalid={errors && !!errors.others}
                        placeholder="Nombre d'ETP"
                        value={dataMonth["others"] || ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                        autoComplete="off"
                     />
                     <FormFeedback>{errors && errors.others}</FormFeedback>
                  </Col>
               </Row>
            </div>
         )}
      </>
   )
}

AccordionEmploymentsMonth.propTypes = {
   monthName: PropTypes.string.isRequired,
   month: PropTypes.string.isRequired,
   year: PropTypes.string.isRequired,
   hospitalId: PropTypes.string.isRequired,
   update: PropTypes.func.isRequired,
   readOnly: PropTypes.bool.isRequired,
   currentUser: PropTypes.object,
}

AccordionEmploymentsMonth.defaultProps = {
   readOnly: true,
}

export default AccordionEmploymentsMonth
