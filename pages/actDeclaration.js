import React from "react"
import {
   Button,
   ButtonDropdown,
   Col,
   Container,
   CustomInput,
   DropdownItem,
   DropdownMenu,
   DropdownToggle,
   Form,
   FormGroup,
   Input,
   Label,
   Row,
} from "reactstrap"
import Layout from "../components/Layout"
import Banner from "../components/Banner"
import "../theme/theme.css"

const ActDeclaration = () => {
   const [dropdownOpen, setOpen] = React.useState(false)

   const toggle = () => setOpen(!dropdownOpen)

   return (
      <Layout>
         <Banner title="Déclaration d'acte"></Banner>
         <Container>
            <div className="text-center mb-5">{"Données d'identification du dossier"}</div>

            <Form>
               <FormGroup row>
                  <Col className="mr-3">
                     <Label for="num_interne">Numéro de dossier interne</Label>
                     <Input id="num_interne" placeholder="Ex: 2019-23091" />
                  </Col>
                  <Col className="mr-3">
                     <Label for="num_pv">Numéro de PV</Label>
                     <Input id="num_pv" placeholder="Optionnel" />
                  </Col>
                  <Col>
                     <Label for="demandeur">Demandeur</Label>
                     <CustomInput type="select" id="demandeur" name="demandeur">
                        <option>TGI Marseille</option>
                        <option>TGI Avignon</option>
                        <option>TGI Nîmes</option>
                     </CustomInput>
                  </Col>
               </FormGroup>
            </Form>

            <div className="text-center mb-5 mt-5">Qui a été examiné?</div>

            <Row>
               <Col sm="3">
                  <Button outline color="secondary" block>
                     Victime
                  </Button>
               </Col>
               <Col sm="3">
                  <Button outline color="secondary" block>
                     Garde à vue
                  </Button>
               </Col>
               <Col sm="3">
                  <Button outline color="secondary" block>
                     Mort
                  </Button>
               </Col>
               <Col sm="3">
                  <ButtonDropdown outline color="primary" block isOpen={dropdownOpen} toggle={toggle}>
                     <DropdownToggle caret>{"Pas d'examen"}</DropdownToggle>
                     <DropdownMenu>
                        <DropdownItem>Radio</DropdownItem>
                        <DropdownItem>Autre</DropdownItem>
                        <DropdownItem>Encore un autre</DropdownItem>
                     </DropdownMenu>
                  </ButtonDropdown>
               </Col>
            </Row>
         </Container>
      </Layout>
   )
}

export default ActDeclaration
