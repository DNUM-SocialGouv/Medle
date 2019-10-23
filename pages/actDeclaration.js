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
   Row,
} from "reactstrap"
import Layout from "../components/Layout"
import Banner from "../components/Banner"
import { Title1, Title2, Label } from "../components/StyledComponents"

const ActDeclaration = () => {
   const [dropdownOpen, setOpen] = React.useState(false)

   const toggle = () => setOpen(!dropdownOpen)

   return (
      <Layout>
         <Title1 className="mt-5 mb-5">Déclaration d'acte</Title1>
         <Container className="w-75">
            <Title2 className="mb-4">{"Données d'identification du dossier"}</Title2>

            <Form>
               <FormGroup row>
                  <Col className="mr-3">
                     <Label htmlFor="num_interne">Numéro de dossier interne</Label>
                     <Input id="num_interne" placeholder="Ex: 2019-23091" />
                  </Col>
                  <Col className="mr-3">
                     <Label htmlFor="num_pv">Numéro de PV</Label>
                     <Input id="num_pv" placeholder="Optionnel" />
                  </Col>
                  <Col>
                     <Label htmlFor="demandeur">Demandeur</Label>
                     <CustomInput type="select" id="demandeur" name="demandeur">
                        <option>TGI Marseille</option>
                        <option>TGI Avignon</option>
                        <option>TGI Nîmes</option>
                     </CustomInput>
                  </Col>
               </FormGroup>
            </Form>

            <Title2 className="mb-4 mt-5">Qui a été examiné?</Title2>

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
                  <ButtonDropdown className="btn-block " isOpen={dropdownOpen} toggle={toggle}>
                     <DropdownToggle outline color="secondary" caret>
                        {"Pas d'examen"}
                     </DropdownToggle>
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
