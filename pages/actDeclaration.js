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
   const [choices, setChoices] = React.useState({})

   const toggle = () => setOpen(!dropdownOpen)

   const ref = React.createRef()

   const handleClick = type => {
      setActTypeSelected(type)
      setChoices({})

      ref.current.scrollIntoView({
         behavior: "smooth",
         block: "start",
      })
   }

   return (
      <Layout>
         <Title1 className="mt-5 mb-5">{"Déclaration d'acte"}</Title1>
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
                     invert={actTypeSelected === "VICTIME" ? 1 : 0}
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
                     invert={actTypeSelected === "GAV" ? 1 : 0}
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
                     invert={actTypeSelected === "MORT" ? 1 : 0}
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
                        {"Autres cas"}
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
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.typeExamen === "Somatique" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, typeExamen: "Somatique" })}
                        >
                           Somatique
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.typeExamen === "Psychiatrique" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, typeExamen: "Psychiatrique" })}
                        >
                           Psychiatrique
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.typeExamen === "Psychologique" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, typeExamen: "Psychologique" })}
                        >
                           Psychologique
                        </Button>
                     </Col>
                  </Row>
                  <Title2 className="mb-4 mt-5">{"Type(s) de violence"}</Title2>
                  <Row>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.typeViolence === "Agression sexuelle" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, typeViolence: "Agression sexuelle" })}
                        >
                           Agression sexuelle
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.typeViolence === "Violence conjugale" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, typeViolence: "Violence conjugale" })}
                        >
                           Violence conjugale
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.typeViolence === "Violence en réunion" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, typeViolence: "Violence en réunion" })}
                        >
                           Violence en réunion
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.typeViolence === "Familiale" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, typeViolence: "Familiale" })}
                        >
                           Familiale
                        </Button>
                     </Col>
                  </Row>
                  <Row className="mt-2">
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.typeViolence === "Autre" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, typeViolence: "Autre" })}
                        >
                           Autre
                        </Button>
                     </Col>
                  </Row>

                  <Title2 className="mb-4 mt-5">{"Heure de l'examen"}</Title2>
                  <Row>
                     <Col>
                        <Button
                           outline
                           color="secondary"
                           block
                           title="de 8h-8h30 à 18h-18h30 samedi de 8h-8h30 à 12h-12h30"
                           invert={choices.heureExamen === "Jour" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, heureExamen: "Jour" })}
                        >
                           Jour
                           <br />
                           (de 8h-8h30 à 18h-18h30, sauf samedi de 8h-8h30 à 12h-12h30)
                        </Button>
                     </Col>
                     <Col>
                        <Button
                           outline
                           color="secondary"
                           block
                           title="de 18h-18h30 à 22h"
                           invert={choices.heureExamen === "Nuit" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, heureExamen: "Nuit" })}
                        >
                           Nuit
                           <br />
                           (de 18h-18h30 à 22h)
                        </Button>
                     </Col>
                     <Col>
                        <Button
                           outline
                           color="secondary"
                           block
                           title="de 22h à 8h-8h30"
                           invert={choices.heureExamen === "Nuit profonde" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, heureExamen: "Nuit profonde" })}
                        >
                           Nuit profonde
                           <br />
                           (de 22h à 8h-8h30)
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
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.profilGenre === "Féminin" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, profilGenre: "Féminin" })}
                        >
                           Féminin
                        </Button>
                     </Col>
                     <Col sm={4}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.profilGenre === "Masculin" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, profilGenre: "Masculin" })}
                        >
                           Masculin
                        </Button>
                     </Col>
                     <Col sm={4}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.profilGenre === "Autre" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, profilGenre: "Autre" })}
                        >
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
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.profilAge === "0-3 ans" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, profilAge: "0-3 ans" })}
                        >
                           0-3 ans
                        </Button>
                     </Col>
                     <Col sm={4}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.profilAge === "3-18 ans" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, profilAge: "3-18 ans" })}
                        >
                           3-18 ans
                        </Button>
                     </Col>
                     <Col sm={4}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.profilAge === "Adulte majeur" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, profilAge: "Adulte majeur" })}
                        >
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
