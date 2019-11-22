import React, { useState } from "react"
import PropTypes from "prop-types"
import { Button, Col, Input, Label, Row } from "reactstrap"
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import EditOutlinedIcon from "@material-ui/icons/Edit"

const AccordionEmploymentsMonth = ({ monthName, monthNumber, numbers }) => {
   const [open, setOpen] = useState(false)
   const numbersForMonth = numbers && numbers[monthNumber] ? numbers[monthNumber] : []

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
                  <EditOutlinedIcon />
               </div>
               <Row>
                  <Col className="mr-3">
                     <Label htmlFor="doctorsNumber">Médecin</Label>
                     <Input
                        id="doctorsNumber"
                        value={numbersForMonth["doctors"] ? numbersForMonth["doctors"] : "Non renseigné"}
                        disabled
                     />
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="secretariesNumber">Secrétaire</Label>
                     <Input
                        id="doctorsNumber"
                        value={numbersForMonth["secretaries"] ? numbersForMonth["secretaries"] : "Non renseigné"}
                        disabled
                     />
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="nursingsNumbers">Aide soignant.e</Label>
                     <Input
                        id="nursingsNumbers"
                        value={numbersForMonth["nursings"] ? numbersForMonth["nursings"] : "Non renseigné"}
                        disabled
                     />
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="executivesNumber">Cadre de santé</Label>
                     <Input
                        id="executivesNumber"
                        value={numbersForMonth["executives"] ? numbersForMonth["executives"] : "Non renseigné"}
                        disabled
                     />
                  </Col>
               </Row>
               <Row className={"mt-2"}>
                  <Col className="mr-3">
                     <Label htmlFor="idesNumber">IDE</Label>
                     <Input
                        id="idesNumber"
                        value={numbersForMonth["doctors"] ? numbersForMonth["doctors"] : "Non renseigné"}
                        disabled
                     />
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="auditoriumAgentsNumber">{"Agent d'amphithéâtre"}</Label>
                     <Input
                        id="auditoriumAgentsNumber"
                        value={
                           numbersForMonth["auditoriumAgents"] ? numbersForMonth["auditoriumAgents"] : "Non renseigné"
                        }
                        disabled
                     />
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="psychologistsNumber">Psychologue</Label>
                     <Input
                        id="psychologistsNumber"
                        value={numbersForMonth["psychologists"] ? numbersForMonth["psychologists"] : "Non renseigné"}
                        disabled
                     />
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="otherEmploymentsNumber">Autres</Label>
                     <Input
                        id="otherEmploymentsNumber"
                        value={numbersForMonth["others"] ? numbersForMonth["others"] : "Non renseigné"}
                        disabled
                     />
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
}

export default AccordionEmploymentsMonth
