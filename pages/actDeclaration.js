import React, { useState, useReducer } from "react"
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

const reducer = (state, action) => {
   switch (action.type) {
      case "internalNum":
         return { ...state, internalNum: action.payload }
      case "pvNum":
         return { ...state, pvNum: action.payload }
      case "examinationDate":
         return { ...state, examinationDate: action.payload }
      case "asker":
         return { ...state, asker: action.payload }
      case "examinedPersonType":
         action.payload.ref.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
         })

         return { ...state, examinedPersonType: action.payload.value }
      case "examinationType":
         return { ...state, examinationType: action.payload }
      case "violenceType":
         return { ...state, violenceType: action.payload }
      case "periodOfDay":
         return { ...state, periodOfDay: action.payload }
      case "examinedPersonGender":
         return { ...state, examinedPersonGender: action.payload }
      case "examinedPersonAge":
         return { ...state, examinedPersonAge: action.payload }
      default:
         throw new Error("Action.type inconnu")
   }
}

const ActDeclaration = () => {
   const [dropdownOpen, setOpen] = useState(false)
   const [isError, setIsError] = useState(false)
   const [isSuccess, setIsSuccess] = useState(false)

   // const [dataReport, setDataReport] = useState({})
   // const [typePersonExaminee, setActTypeSelected] = useState(false)
   // const [choices, setChoices] = useState({})

   const initialState = {
      pvNum: "",
      internalNum: "",
      examinationDate: "",
      asker: "",
      examinedPersonType: "",
      examinedPersonGender: "",
      examinedPersonAge: "",
      examinationType: "",
      violenceType: "",
      periodOfDay: "",
      bloodExaminationsNb: 0,
   }

   const [state, dispatch] = useReducer(reducer, initialState)

   const toggle = () => setOpen(!dropdownOpen)

   const ref = React.createRef()

   const validAct = async () => {
      setIsError(false)
      setIsSuccess(false)

      const data = {
         num_pv: state.pvNum,
         num_interne: state.internalNum,
         date_examen: state.examinationDate,
         demandeur: state.asker,
         periode_journee: state.periodOfDay,
         type_personne_examinee: state.typePersonExaminee,
         age_personne_examinee: state.profilAge,
         genre_personne_examinee: state.profilGenre,
         type_examen: state.typeExamen,
         type_violence: state.typeViolence,
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
                  <Label htmlFor="internalNum">Numéro de dossier interne</Label>
                  <Input
                     id="internalNum"
                     placeholder="Ex: 2019-23091"
                     onChange={e => dispatch({ type: e.target.id, payload: e.target.value })}
                  />
               </Col>
               <Col className="mr-3">
                  <Label htmlFor="pvNum">Numéro de PV</Label>
                  <Input
                     id="pvNum"
                     placeholder="Optionnel"
                     onChange={e => dispatch({ type: e.target.id, payload: e.target.value })}
                  />
               </Col>
               <Col className="mr-3">
                  <Label htmlFor="examinationDate">{"Date d'examen"}</Label>
                  <Input
                     id="examinationDate"
                     type="date"
                     onChange={e => dispatch({ type: e.target.id, payload: e.target.value })}
                  />
               </Col>
               <Col>
                  <Label htmlFor="asker">Demandeur</Label>
                  <CustomInput
                     type="select"
                     id="asker"
                     name="asker"
                     onChange={e => dispatch({ type: e.target.id, payload: e.target.value })}
                  >
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
                     invert={state.examinedPersonType === "Victime" ? 1 : 0}
                     outline
                     color="secondary"
                     block
                     onClick={() => dispatch({ type: "examinedPersonType", payload: { value: "Victime", ref } })}
                  >
                     Victime
                  </Button>
               </Col>
               <Col>
                  <Button
                     invert={state.examinedPersonType === "GAV" ? 1 : 0}
                     outline
                     color="secondary"
                     block
                     onClick={() => dispatch({ type: "examinedPersonType", payload: { value: "GAV", ref } })}
                  >
                     Garde à vue
                  </Button>
               </Col>
               <Col>
                  <Button
                     invert={state.examinedPersonType === "MORT" ? 1 : 0}
                     outline
                     color="secondary"
                     block
                     onClick={() => dispatch({ type: "examinedPersonType", payload: { value: "MORT", ref } })}
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
                        <DropdownItem
                           onClick={() => dispatch({ type: "examinedPersonType", payload: { value: "Assises", ref } })}
                        >
                           Assises
                        </DropdownItem>
                        <DropdownItem
                           onClick={() =>
                              dispatch({ type: "examinedPersonType", payload: { value: "Reconstitution", ref } })
                           }
                        >
                           Reconstitution
                        </DropdownItem>
                        <DropdownItem
                           onClick={() =>
                              dispatch({ type: "examinedPersonType", payload: { value: "Expertise", ref } })
                           }
                        >
                           Expertise
                        </DropdownItem>
                     </DropdownMenu>
                  </ButtonDropdown>
               </Col>
            </Row>

            {state.examinedPersonType === "Victime" && (
               <>
                  <Title2 className="mb-4 mt-5">{"Type(s) d'examen"}</Title2>
                  <Row>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state.examinationType === "Somatique" ? 1 : 0}
                           onClick={() => dispatch({ type: "examinationType", payload: "Somatique" })}
                        >
                           Somatique
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state.examinationType === "Psychiatrique" ? 1 : 0}
                           onClick={() => dispatch({ type: "examinationType", payload: "Psychiatrique" })}
                        >
                           Psychiatrique
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state.examinationType === "Psychologique" ? 1 : 0}
                           onClick={() => dispatch({ type: "examinationType", payload: "Psychologique" })}
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
                           invert={state.violenceType === "Conjugale" ? 1 : 0}
                           onClick={() => dispatch({ type: "violenceType", payload: "Conjugale" })}
                        >
                           Conjugale
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state.violenceType === "Urbaine" ? 1 : 0}
                           onClick={() => dispatch({ type: "violenceType", payload: "Urbaine" })}
                        >
                           Urbaine
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state.violenceType === "En réunion" ? 1 : 0}
                           onClick={() => dispatch({ type: "violenceType", payload: "En réunion" })}
                        >
                           En réunion
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state.violenceType === "Scolaire" ? 1 : 0}
                           onClick={() => dispatch({ type: "violenceType", payload: "Scolaire" })}
                        >
                           Scolaire
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state.violenceType === "Familiale" ? 1 : 0}
                           onClick={() => dispatch({ type: "violenceType", payload: "Familiale" })}
                        >
                           Familiale
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state.violenceType === "Sur ascendant" ? 1 : 0}
                           onClick={() => dispatch({ type: "violenceType", payload: "Sur ascendant" })}
                        >
                           Sur ascendant
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state.violenceType === "Agression sexuelle" ? 1 : 0}
                           onClick={() => dispatch({ type: "violenceType", payload: "Agression sexuelle" })}
                        >
                           Agression sexuelle
                        </Button>
                     </Col>
                     <Col sm={3}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state.violenceType === "Attentat" ? 1 : 0}
                           onClick={() => dispatch({ type: "violenceType", payload: "Attentat" })}
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
                           invert={state.periodOfDay === "Jour" ? 1 : 0}
                           onClick={() => dispatch({ type: "periodOfDay", payload: "Jour" })}
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
                           invert={state.periodOfDay === "Nuit" ? 1 : 0}
                           onClick={() => dispatch({ type: "periodOfDay", payload: "Nuit" })}
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
                           invert={state.periodOfDay === "Nuit profonde" ? 1 : 0}
                           onClick={() => dispatch({ type: "periodOfDay", payload: "Nuit profonde" })}
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
                           invert={state.examinedPersonGender === "Féminin" ? 1 : 0}
                           onClick={() => dispatch({ type: "examinedPersonGender", payload: "Féminin" })}
                        >
                           Féminin
                        </Button>
                     </Col>
                     <Col sm={4}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state.examinedPersonGender === "Masculin" ? 1 : 0}
                           onClick={() => dispatch({ type: "examinedPersonGender", payload: "Masculin" })}
                        >
                           Masculin
                        </Button>
                     </Col>
                     <Col sm={4}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state.examinedPersonGender === "Autre" ? 1 : 0}
                           onClick={() => dispatch({ type: "examinedPersonGender", payload: "Autre" })}
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
                           invert={state.examinedPersonAge === "0-3 ans" ? 1 : 0}
                           onClick={() => dispatch({ type: "examinedPersonAge", payload: "0-3 ans" })}
                        >
                           0-3 ans
                        </Button>
                     </Col>
                     <Col sm={4}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state.examinedPersonAge === "3-18 ans" ? 1 : 0}
                           onClick={() => dispatch({ type: "examinedPersonAge", payload: "3-18 ans" })}
                        >
                           3-18 ans
                        </Button>
                     </Col>
                     <Col sm={4}>
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state.examinedPersonAge === "Adulte majeur" ? 1 : 0}
                           onClick={() => dispatch({ type: "examinedPersonAge", payload: "Adulte majeur" })}
                        >
                           Adulte majeur
                        </Button>
                     </Col>
                  </Row>

                  <Title2 className="mb-4 mt-5">{"Examens complémentaires"}</Title2>
                  <Row>
                     <Col sm={4}>
                        <Counter>Sanguins</Counter>
                     </Col>
                     <Col sm={4}>
                        <Counter>Radios</Counter>
                     </Col>
                     <Col sm={4}>
                        <Counter>IRM</Counter>
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
