import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Button, Col, Input, Label, Row, FormFeedback } from "reactstrap"
import { API_URL, EMPLOYMENTS_ENDPOINT } from "../config"
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import EditOutlinedIcon from "@material-ui/icons/Edit"
import { AnchorButton } from "../components/StyledComponents"
import { isEmpty } from "../utils/misc"
import { STATUS_200_OK } from "../utils/HttpStatus"

const inputs = [
   "doctors",
   "secretaries",
   "nursings",
   "executives",
   "idesNumber",
   "auditoriumAgents",
   "psychologists",
   "others",
]

const AccordionEmploymentsMonth = ({ monthName, month, year, hospitalId, errors, readOnly }) => {
   const [open, setOpen] = useState(false)
   const [readOnlyState, setReadOnlyState] = useState(readOnly)
   const [errorsState, setErrorsState] = useState(errors)

   const [dataMonth, setDataMonth] = useState({})

   useEffect(() => {
      const fetchData = async () => {
         let result

         try {
            result = await fetch(API_URL + EMPLOYMENTS_ENDPOINT + `/${hospitalId}/${year}/${month}`, {
               method: "GET",
            })
            const json = await result.json()

            setDataMonth(json)

            if (result.status !== STATUS_200_OK) {
               //throw new Error(json && json.message ? json.message : "")
               return { error: "Erreur backoffice 1" }
            }
         } catch (error) {
            console.error(error)
            return { error: "Erreur backoffice 2" }
         }
      }

      fetchData()
   }, [hospitalId, month, open, year])

   const handleChange = event => {
      event.preventDefault()

      setDataMonth({ ...dataMonth, [event.target.name]: event.target.value })
   }

   const toggleReadOnly = () => setReadOnlyState(state => !state)

   const handleUpdate = () => {
      if (validate()) {
         update(month, dataMonth)
         toggleReadOnly()
      }
   }

   const validate = () => {
      setErrorsState({})

      const newErrors = {}

      inputs.forEach(key => {
         if (!dataMonth[key]) {
            newErrors[key] = "Obligatoire"
         } else {
            const val = /^[0-9]+$/.test(dataMonth[key]) && parseInt(dataMonth[key], 10)

            if (val < 0) {
               newErrors[key] = "Numérique positif"
            }
         }
      })

      if (!isEmpty(newErrors)) {
         setErrorsState(newErrors)
         return false
      }

      return true
   }

   const update = async () => {
      let result
      try {
         result = await fetch(API_URL + EMPLOYMENTS_ENDPOINT + `/${hospitalId}/${year}/${month}`, {
            method: "PUT",
            body: JSON.stringify(dataMonth),
         })
         const json = await result.json()

         if (result.status !== STATUS_200_OK) {
            //throw new Error(json && json.message ? json.message : "")
            console.error("Error", json.error)
            return { error: json.error }
         }
         // setSuccess("Vos informations ont bien été enregistrées.")
      } catch (error) {
         console.error(error)
         return { error: "Erreur backoffice 2" }
      }
   }

   return (
      <>
         <Button outline color="secondary" block className="text-left pl-4 pt-2 pb-2" onClick={() => setOpen(!open)}>
            {monthName}
            {!open && <ArrowForwardIosIcon className="float-right" />}
            {open && <ExpandMoreIcon className="float-right" />}
         </Button>
         {open && (
            <div className="px-2">
               <div className="text-right pr-2 pt-3 pb-2">
                  {readOnlyState ? (
                     <EditOutlinedIcon onClick={toggleReadOnly} />
                  ) : (
                     <AnchorButton onClick={handleUpdate}>Enregistrer</AnchorButton>
                  )}
               </div>
               <Row>
                  <Col className="mr-3">
                     <Label htmlFor="doctors">Médecin</Label>
                     <Input
                        name="doctors"
                        invalid={errorsState && !!errorsState.doctors}
                        value={dataMonth["doctors"] ? dataMonth["doctors"] : ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                     />
                     <FormFeedback>{errorsState && errorsState.doctors}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="secretaries">Secrétaire</Label>
                     <Input
                        name="secretaries"
                        invalid={errorsState && !!errorsState.secretaries}
                        value={dataMonth["secretaries"] ? dataMonth["secretaries"] : ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                     />
                     <FormFeedback>{errorsState && errorsState.secretaries}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="nursings">Aide soignant.e</Label>
                     <Input
                        name="nursings"
                        invalid={errorsState && !!errorsState.nursings}
                        value={dataMonth["nursings"] ? dataMonth["nursings"] : ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                     />
                     <FormFeedback>{errorsState && errorsState.nursings}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="executives">Cadre de santé</Label>
                     <Input
                        name="executives"
                        invalid={errorsState && !!errorsState.executives}
                        value={dataMonth["executives"] ? dataMonth["executives"] : ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                     />
                     <FormFeedback>{errorsState && errorsState.executives}</FormFeedback>
                  </Col>
               </Row>
               <Row className={"mt-2"}>
                  <Col className="mr-3">
                     <Label htmlFor="idesNumber">IDE</Label>
                     <Input
                        name="idesNumber"
                        invalid={errorsState && !!errorsState.idesNumber}
                        value={dataMonth["idesNumber"] ? dataMonth["idesNumber"] : ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                     />
                     <FormFeedback>{errorsState && errorsState.idesNumber}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="auditoriumAgents">{"Agent d'amphithéâtre"}</Label>
                     <Input
                        name="auditoriumAgents"
                        invalid={errorsState && !!errorsState.auditoriumAgents}
                        value={dataMonth["auditoriumAgents"] ? dataMonth["auditoriumAgents"] : ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                     />
                     <FormFeedback>{errorsState && errorsState.auditoriumAgents}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="psychologists">Psychologue</Label>
                     <Input
                        name="psychologists"
                        invalid={errorsState && !!errorsState.psychologists}
                        value={dataMonth["psychologists"] ? dataMonth["psychologists"] : ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                     />
                     <FormFeedback>{errorsState && errorsState.psychologists}</FormFeedback>
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="others">Autres</Label>
                     <Input
                        name="others"
                        invalid={errorsState && !!errorsState.others}
                        value={dataMonth["others"] ? dataMonth["others"] : ""}
                        onChange={event => handleChange(event)}
                        disabled={readOnlyState}
                     />
                     <FormFeedback>{errorsState && errorsState.others}</FormFeedback>
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
   errors: PropTypes.object,
   readOnly: PropTypes.bool.isRequired,
}

AccordionEmploymentsMonth.defaultProps = {
   readOnly: true,
}

export default AccordionEmploymentsMonth
