import React from "react"
import {
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
import { Button, Title1, Title2, Label, ValidationButton } from "../components/StyledComponents"

const ActDeclaration = () => {
   const [dropdownOpen, setOpen] = React.useState(false)
   const [actTypeSelected, setActTypeSelected] = React.useState(false)

   const toggle = () => setOpen(!dropdownOpen)

   const ref = React.createRef()

   const handleClick = type => {
      setActTypeSelected(type)

      ref.current.scrollIntoView({
         behavior: "smooth",
         block: "start",
      })
   }

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

            <Title2 className="mb-4 mt-5" ref={ref}>
               Qui a été examiné?
            </Title2>

            <Row>
               <Col>
                  <Button
                     invert={actTypeSelected === "VICTIME"}
                     outline
                     color="secondary"
                     block
                     onClick={() => handleClick("VICTIME")}
                  >
                     Victime
                  </Button>
               </Col>
               <Col>
                  <Button
                     invert={actTypeSelected === "GAV"}
                     outline
                     color="secondary"
                     block
                     onClick={() => setActTypeSelected("GAV")}
                  >
                     Garde à vue
                  </Button>
               </Col>
               <Col>
                  <Button
                     invert={actTypeSelected === "MORT"}
                     outline
                     color="secondary"
                     block
                     onClick={() => setActTypeSelected("MORT")}
                  >
                     Mort
                  </Button>
               </Col>
               <Col>
                  <ButtonDropdown className="btn-block " isOpen={dropdownOpen} toggle={toggle}>
                     <DropdownToggle outline color="secondary" caret>
                        {"Pas d'examen"}
                     </DropdownToggle>
                     <DropdownMenu>
                        <DropdownItem onClick={() => setActTypeSelected("RADIO")}>Radio</DropdownItem>
                        <DropdownItem>Autre</DropdownItem>
                        <DropdownItem>Encore un autre</DropdownItem>
                     </DropdownMenu>
                  </ButtonDropdown>
               </Col>
            </Row>

            {actTypeSelected === "VICTIME" && (
               <>
                  <Title2 className="mb-4 mt-5">{"Type(s) d'examen"}</Title2>
                  <Row>
                     <Col sm={3}>
                        <Button outline color="secondary" block>
                           Somatique
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button outline color="secondary" block>
                           Psychiatrique
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button outline color="secondary" block>
                           Psychologique
                        </Button>
                     </Col>
                  </Row>
                  <Title2 className="mb-4 mt-5">{"Type(s) de violence"}</Title2>
                  <Row>
                     <Col sm={3}>
                        <Button outline color="secondary" block>
                           Agression sexuelle
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button outline color="secondary" block>
                           Violence conjugale
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button outline color="secondary" block>
                           Violence en réunion
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button outline color="secondary" block>
                           Familiale
                        </Button>
                     </Col>
                  </Row>
                  <Row className="mt-2">
                     <Col sm={3}>
                        <Button outline color="secondary" block>
                           Autre
                        </Button>
                     </Col>
                  </Row>

                  <Title2 className="mb-4 mt-5">{"Heure de l'examen"}</Title2>
                  <Row>
                     <Col>
                        <Button outline color="secondary" block>
                           Jour
                        </Button>
                     </Col>
                     <Col>
                        <Button outline color="secondary" block>
                           Nuit
                        </Button>
                     </Col>
                     <Col>
                        <Button outline color="secondary" block>
                           Nuit profonde
                        </Button>
                     </Col>
                  </Row>

                  <Title2 className="mb-2 mt-5">{"Profil de la victime"}</Title2>
                  <Row>
                     <Col sm={4} className="mb-1">
                        Genre
                     </Col>
                  </Row>
                  <Row>
                     <Col sm={4}>
                        <Button outline color="secondary" block>
                           Féminin
                        </Button>
                     </Col>
                     <Col sm={4}>
                        <Button outline color="secondary" block>
                           Masculin
                        </Button>
                     </Col>
                     <Col sm={4}>
                        <Button outline color="secondary" block>
                           Autre
                        </Button>
                     </Col>
                  </Row>
                  <Row className="mt-3">
                     <Col sm={4} className="mb-1">
                        Âge
                     </Col>
                  </Row>
                  <Row>
                     <Col sm={4}>
                        <Button outline color="secondary" block>
                           0-3 ans
                        </Button>
                     </Col>
                     <Col sm={4}>
                        <Button outline color="secondary" block>
                           3-18 ans
                        </Button>
                     </Col>
                     <Col sm={4}>
                        <Button outline color="secondary" block>
                           Adulte majeur
                        </Button>
                     </Col>
                  </Row>
                  <div className="text-center mt-5">
                     <ValidationButton color="primary" size="lg" className="center">
                        Valider
                     </ValidationButton>
                  </div>
               </>
            )}
         </Container>
      </Layout>
   )
}

export default ActDeclaration
