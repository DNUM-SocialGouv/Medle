import React from "react"
import Router from "next/router"
import {
   Alert,
   ButtonDropdown,
   Col,
   Container,
   CustomInput,
   DropdownItem,
   DropdownMenu,
   DropdownToggle,
   Input,
   Row,
} from "reactstrap"
import Layout from "../components/Layout"
import Counter from "../components/Counter"
import { Button, Title1, Title2, Label, ValidationButton } from "../components/StyledComponents"
import { STATUS_200_OK } from "../utils/HttpStatus"

const ActDeclaration = () => {
   const [dropdownOpen, setOpen] = React.useState(false)
   const [dataReport, setDataReport] = React.useState({})
   const [typePersonExaminee, setActTypeSelected] = React.useState(false)
   const [choices, setChoices] = React.useState({})
   const [isError, setIsError] = React.useState(false)
   const [isSuccess, setIsSuccess] = React.useState(false)

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

   const handleChange = e => {
      setDataReport({ ...dataReport, [e.target.id]: e.target.value })
   }

   const validAct = async () => {
      setIsError(false)
      setIsSuccess(false)

      const data = {
         num_pv: dataReport.num_pv,
         num_interne: dataReport.num_interne,
         demandeur: dataReport.demandeur,
         periode_journee: choices.periodeJournee,
         type_personne_examinee: typePersonExaminee,
         age_personne_examinee: choices.profilAge,
         genre_personne_examinee: choices.profilGenre,
         type_examen: choices.typeExamen,
         type_violence: choices.typeViolence,
         duree: 0, // TODO ajuster la durée ? À demander à Sania
         etablissement_sante_id: 1, // TODO : à récupérer du user courant
      }

      const api = "/api/actDeclaration"

      let response, json

      try {
         response = await fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
         })
         json = await response.json()
      } catch (error) {
         console.error(error)
         setIsError(true)
         return
      }

      if (response.status === STATUS_200_OK) {
         setIsSuccess("Déclaration envoyée")
         Router.push({
            pathname: "/actConfirmation",
            query: {
               id: data.num_interne,
               num_pv: data.num_pv,
            },
         })
      } else {
         setIsError(json && json.message ? json.message : "Problème de base de données")
      }
   }

   return (
      <Layout>
         <Title1 className="mt-5 mb-5">{"Déclaration d'acte"}</Title1>
         <Container className="w-75">
            <Title2 className="mb-4">{"Données d'identification du dossier"}</Title2>

            {isError && <Alert color="danger">{isError}</Alert>}
            {isSuccess && <Alert color="primary">{isSuccess}</Alert>}

            <Row>
               <Col className="mr-3">
                  <Label htmlFor="num_interne">Numéro de dossier interne</Label>
                  <Input id="num_interne" placeholder="Ex: 2019-23091" onChange={e => handleChange(e)} />
               </Col>
               <Col className="mr-3">
                  <Label htmlFor="num_pv">Numéro de PV</Label>
                  <Input id="num_pv" placeholder="Optionnel" onChange={e => handleChange(e)} />
               </Col>
               <Col className="mr-3">
                  <Label htmlFor="date_examen">{"Date d'examen"}</Label>
                  <Input id="date_examen" type="date" onChange={e => handleChange(e)} />
               </Col>
               <Col>
                  <Label htmlFor="demandeur">Demandeur</Label>
                  <CustomInput type="select" id="demandeur" name="demandeur" onChange={e => handleChange(e)}>
                     <option>TGI Marseille</option>
                     <option>TGI Avignon</option>
                     <option>TGI Nîmes</option>
                  </CustomInput>
               </Col>
            </Row>

            <Title2 className="mb-4 mt-5" ref={ref}>
               Qui a été examiné?
            </Title2>

            <Row>
               <Col>
                  <Button
                     invert={typePersonExaminee === "Victime" ? 1 : 0}
                     outline
                     color="secondary"
                     block
                     onClick={() => handleClick("Victime")}
                  >
                     Victime
                  </Button>
               </Col>
               <Col>
                  <Button
                     invert={typePersonExaminee === "GAV" ? 1 : 0}
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
                     invert={typePersonExaminee === "MORT" ? 1 : 0}
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
                        <DropdownItem onClick={() => setActTypeSelected("ASSISES")}>Assises</DropdownItem>
                        <DropdownItem onClick={() => setActTypeSelected("RECONSTITUTION")}>Reconstitution</DropdownItem>
                        <DropdownItem onClick={() => setActTypeSelected("EXPERTISE")}>Expertise</DropdownItem>
                     </DropdownMenu>
                  </ButtonDropdown>
               </Col>
            </Row>

            {typePersonExaminee === "Victime" && (
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
                     <Col sm={3} className="mb-4">
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.typeViolence === "Conjugale" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, typeViolence: "Conjugale" })}
                        >
                           Conjugale
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.typeViolence === "Urbaine" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, typeViolence: "Urbaine" })}
                        >
                           Urbaine
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.typeViolence === "En réunion" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, typeViolence: "En réunion" })}
                        >
                           En réunion
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.typeViolence === "Scolaire" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, typeViolence: "Scolaire" })}
                        >
                           Scolaire
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
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={choices.typeViolence === "Sur ascendant" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, typeViolence: "Sur ascendant" })}
                        >
                           Sur ascendant
                        </Button>
                     </Col>
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
                           invert={choices.typeViolence === "Attentat" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, typeViolence: "Attentat" })}
                        >
                           Attentat
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
                           invert={choices.periodeJournee === "Jour" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, periodeJournee: "Jour" })}
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
                           invert={choices.periodeJournee === "Nuit" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, periodeJournee: "Nuit" })}
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
                           invert={choices.periodeJournee === "Nuit profonde" ? 1 : 0}
                           onClick={() => setChoices({ ...choices, periodeJournee: "Nuit profonde" })}
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

                  <Title2 className="mb-4 mt-5">{"Examens complémentaires"}</Title2>
                  <Row>
                     <Col sm={4}>
                        <Counter onClick={() => setChoices({ ...choices, typeExamen: "Somatique" })}>Sanguins</Counter>
                     </Col>
                     <Col sm={4}>
                        <Counter onClick={() => setChoices({ ...choices, typeExamen: "Somatique" })}>Radios</Counter>
                     </Col>
                     <Col sm={4}>
                        <Counter onClick={() => setChoices({ ...choices, typeExamen: "Somatique" })}>IRM</Counter>
                     </Col>
                  </Row>

                  <div className="text-center mt-5">
                     <ValidationButton color="primary" size="lg" className="center" onClick={validAct}>
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
