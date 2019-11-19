import React, { useState } from "react"
import PropTypes from "prop-types"
import { Button, Col, Input, Label, Row } from "reactstrap"
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import EditOutlinedIcon from "@material-ui/icons/Edit"

const AccordionEmploymentsMonth = ({ title }) => {
   const [open, setOpen] = useState(false)
   return (
      <>
         <Button outline color="secondary" block className="text-left pl-4 pt-2 pb-2" onClick={() => setOpen(!open)}>
            {title}
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
                     <Input id="doctorsNumber" value="3,4" disabled />
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="secretariesNumber">Secrétaire</Label>
                     <Input id="doctorsNumber" value="3,4" disabled />
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="nursingsNumbers">Aide soignant.e</Label>
                     <Input id="nursingsNumbers" value="3,4" disabled />
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="executivesNumber">Cadre de santé</Label>
                     <Input id="executivesNumber" value="3,4" disabled />
                  </Col>
               </Row>
               <Row className={"mt-2"}>
                  <Col className="mr-3">
                     <Label htmlFor="idesNumber">IDE</Label>
                     <Input id="idesNumber" value="3,4" disabled />
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="auditoriumAgentsNumber">{"Agent d'amphithéâtre"}</Label>
                     <Input id="auditoriumAgentsNumber" value="3,4" disabled />
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="psychologistsNumber">Psychologue</Label>
                     <Input id="psychologistsNumber" value="3,4" disabled />
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="otherEmploymentsNumber">Autres</Label>
                     <Input id="otherEmploymentsNumber" value="3,4" disabled />
                  </Col>
               </Row>
            </div>
         )}
      </>
   )
}

AccordionEmploymentsMonth.propTypes = {
   title: PropTypes.string,
}

export default AccordionEmploymentsMonth
