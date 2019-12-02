import React, { useState } from "react"
import Link from "next/link"
import PropTypes from "prop-types"
import { Button, Col, Input, Label, Row, FormFeedback } from "reactstrap"
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import EditOutlinedIcon from "@material-ui/icons/Edit"
import { AnchorButton } from "../components/StyledComponents"
import { isEmpty } from "../utils/misc"

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

const AccordionEmploymentsMonth = ({ monthName, monthNumber, numbers, update, errors, readOnly }) => {
   const [open, setOpen] = useState(false)
   //const numbersForMonth = numbers && numbers[monthNumber] ? numbers[monthNumber] : []

   const [numbersForMonth, setNumbersForMonth] = useState(numbers || {})
   const [readOnlyState, setReadOnlyState] = useState(readOnly)
   const [errorsState, setErrorsState] = useState(errors)

   const handleChange = event => {
      event.preventDefault()

      setNumbersForMonth({ ...numbersForMonth, [event.target.name]: event.target.value })
   }

   const toggleReadOnly = () => setReadOnlyState(state => !state)

   const handleUpdate = () => {
      if (validate()) {
         update(monthNumber, numbersForMonth)
         toggleReadOnly()
      }
   }

   const validate = () => {
      setErrorsState({})

      const newErrors = {}

      inputs.forEach(key => {
         if (!numbersForMonth[key]) {
            newErrors[key] = "Obligatoire"
         } else {
            const val = /^[0-9]+$/.test(numbersForMonth[key]) && parseInt(numbersForMonth[key], 10)

            if (!val || val < 0) {
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
                        value={numbersForMonth["doctors"] ? numbersForMonth["doctors"] : ""}
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
                        value={numbersForMonth["secretaries"] ? numbersForMonth["secretaries"] : ""}
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
                        value={numbersForMonth["nursings"] ? numbersForMonth["nursings"] : ""}
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
                        value={numbersForMonth["executives"] ? numbersForMonth["executives"] : ""}
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
                        value={numbersForMonth["idesNumber"] ? numbersForMonth["idesNumber"] : ""}
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
                        value={numbersForMonth["auditoriumAgents"] ? numbersForMonth["auditoriumAgents"] : ""}
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
                        value={numbersForMonth["psychologists"] ? numbersForMonth["psychologists"] : ""}
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
                        value={numbersForMonth["others"] ? numbersForMonth["others"] : ""}
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
   monthNumber: PropTypes.string.isRequired,
   numbers: PropTypes.object.isRequired,
   update: PropTypes.func.isRequired,
   errors: PropTypes.object,
   readOnly: PropTypes.bool.isRequired,
}

AccordionEmploymentsMonth.defaultProps = {
   readOnly: true,
}

export default AccordionEmploymentsMonth
