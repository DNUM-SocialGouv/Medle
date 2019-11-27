import React from "react"
import ActBlock from "../components/ActBlock"
import Counter from "../components/Counter"
import { Col, Row } from "reactstrap"

import moment from "moment"
import { Title2 } from "../components/StyledComponents"

import { FRENCH_PUBLIC_HOLIDAY_ENDPOINT } from "../config"
import fetch from "isomorphic-unfetch"
import { isEmpty } from "./misc"

const initFetchFrenchPublicHoliday = async () => {
   const currentYear = moment().year()
   try {
      // TODO : cache data for some duration and refresh after time elapsed
      const res = await fetch(FRENCH_PUBLIC_HOLIDAY_ENDPOINT + currentYear)
      const json = await res.json()
      console.log("Jours fériés chargés")
      frenchPublicHoliday = json.map(elt => elt.date)
   } catch (error) {
      console.error("Erreur chargment jours fériés", error)
      frenchPublicHoliday = []
   }
}

let frenchPublicHoliday

initFetchFrenchPublicHoliday()

const blockBuilder = (type, values) => {
   switch (type) {
      case "examinationTypes":
         return {
            type,
            title: "Type(s) d'examen",
            getValues: () => values,
            render: function render(props) {
               return <ActBlock {...props} />
            },
            validate: x => !!x,
            errorMessage: "Obligatoire",
         }

      case "counters":
         return {
            type,
            render: function render({ dispatch, state }) {
               return (
                  <>
                     <Title2 className="mb-4 mt-5">{"Examens complémentaires"}</Title2>
                     <Row>
                        <Col>
                           <Counter dispatch={dispatch} state={state} type={"bioExaminationsNumber"}>
                              Biologiques
                           </Counter>
                        </Col>
                        <Col>
                           <Counter dispatch={dispatch} state={state} type={"imagingExaminationsNumber"}>
                              Imageries
                           </Counter>
                        </Col>
                        <Col>
                           <Counter dispatch={dispatch} state={state} type={"othersExaminationNumber"}>
                              Autres
                           </Counter>
                        </Col>
                     </Row>
                  </>
               )
            },
         }
      case "periodOfDay":
         return {
            type: "periodOfDay",
            title: "Heure de l'examen",
            getValues: ({ situationDate }) =>
               periodOfDayValues[situationDate].period.map(elt => ({ title: elt.title, subTitle: elt.subTitle })),
            render: function render(props) {
               return <ActBlock {...props} />
            },
            validate: x => !!x,
            errorMessage: "Obligatoire",
         }
      case "personGender":
         return {
            type: "personGender",
            subTitle: "Genre",
            getValues: () => ["Féminin", "Masculin", "Autre"],
            render: function render(props) {
               return <ActBlock {...props} />
            },
            validate: x => !!x,
            errorMessage: "Obligatoire",
         }
      case "personAgeTag":
         return {
            type: "personAgeTag",
            subTitle: "Âge",
            getValues: () => ["0-2 ans", "3-17 ans", "+ de 18 ans"],
            render: function render(props) {
               return <ActBlock {...props} />
            },
            validate: x => !!x,
            errorMessage: "Obligatoire",
         }
   }
}

const profiles = {
   Victime: [
      blockBuilder("examinationTypes", ["Somatique", "Psychiatrique", "Psychologique"]),
      {
         type: "violenceTypes",
         title: "Type(s) de violence",
         getValues: () => [
            "Conjugale",
            "Urbaine",
            "En réunion",
            "Scolaire",
            "Familiale",
            "Sur ascendant",
            "Agression sexuelle",
            { title: "Attentat", subValues: ["Bataclan", "Hyper Cacher"] },
         ],
         render: function render(props) {
            return <ActBlock {...props} />
         },
         validate: x => !!x,
         errorMessage: "Obligatoire",
      },
      blockBuilder("counters"),
      blockBuilder("periodOfDay"),
      {
         type: "rawContent",
         render: function render() {
            return <Title2 className="mb-2 mt-5">{"Profil de la victime"}</Title2>
         },
      },
      blockBuilder("personGender"),
      blockBuilder("personAgeTag"),
   ],
   "Gardé.e à vue": [
      blockBuilder("examinationTypes", ["Somatique", "Psychiatrique", "Âge osseux"]),
      blockBuilder("counters"),
      blockBuilder("periodOfDay"),
      {
         type: "multipleVisits",
         title: "Plusieurs passages nécessaires",
         getValues: () => ["Oui", "Non"],
         render: function render(props) {
            return <ActBlock {...props} />
         },
         validate: x => !!x,
         errorMessage: "Obligatoire",
      },
      {
         type: "location",
         title: "Lieu de l'examen",
         getValues: () => ["Commissariat", "UMJ"],
         render: function render(props) {
            return <ActBlock {...props} />
         },
         validate: x => !!x,
         errorMessage: "Obligatoire",
      },
      {
         type: "rawContent",
         render: function render() {
            return <Title2 className="mb-2 mt-5">{"Profil de la personne gardée à vue"}</Title2>
         },
      },
      blockBuilder("personGender"),
      {
         type: "personAgeTag",
         subTitle: "Âge",
         getValues: () => ["Mineur", "Majeur", "Non déterminé"],
         render: function render(props) {
            return <ActBlock {...props} />
         },
         validate: x => !!x,
         errorMessage: "Obligatoire",
      },
   ],
   "Personne décédée": [
      blockBuilder("examinationTypes", ["Autopsie", "Levée de corps"]),
      blockBuilder("counters"),
      blockBuilder("periodOfDay"),
      {
         type: "rawContent",
         render: function render() {
            return <Title2 className="mb-2 mt-5">{"Profil de la personne examinée"}</Title2>
         },
      },
      blockBuilder("personGender"),
      blockBuilder("personAgeTag"),
   ],
}

const getProfiledBlocks = (profile, dispatch, state, errors) => {
   const res = profiles[profile].map(elt =>
      elt.type === "rawContent"
         ? elt.render({ key: elt.type })
         : elt.type === "counters"
         ? elt.render({ key: elt.type, dispatch, state })
         : elt.render({
              key: elt.type,
              title: elt.title,
              subTitle: elt.subTitle,
              type: elt.type,
              values: elt.getValues(state),
              dispatch,
              state,
              invalid: errors && errors[elt.type],
           }),
   )

   return res
}

const runProfiledValidation = (profile, state, setErrors) => {
   let errors = {}
   profiles[profile].forEach(elt => {
      errors = !elt.validate || elt.validate(state[elt.type]) ? errors : { ...errors, [elt.type]: elt.errorMessage }
   })
   setErrors(prev => ({ ...prev, ...errors }))

   return isEmpty(errors)
}

const profileValues = [
   "Victime",
   "Gardé.e à vue",
   "Personne décédée",
   {
      title: "Autre",
      subValues: ["Personne retenue", "Blessé route", "Âge osseux hors GAV", "Assises", "Reconstitution", "Expertise"],
   },
]

const periodOfDayValues = {
   week: {
      title: "lun.-ven.",
      period: [
         {
            title: "Nuit profonde",
            subTitle: "(00h-8h30)",
         },
         {
            title: "Journée",
            subTitle: "(8h30-18h30)",
         },
         {
            title: "Soirée",
            subTitle: "(18h30-22h)",
         },
         {
            title: "Nuit",
            subTitle: "(22h-00h)",
         },
      ],
   },
   saturday: {
      title: "sam.",
      period: [
         {
            title: "Nuit profonde",
            subTitle: "(00h-8h30)",
         },
         {
            title: "Matin",
            subTitle: "(8h30-12h30)",
         },
         {
            title: "Après-midi",
            subTitle: "(12h30-18h)",
         },
         {
            title: "Soirée et nuit",
            subTitle: "(18h-00h)",
         },
      ],
   },
   sunday: {
      title: "dim. et férié",
      period: [
         {
            title: "Nuit profonde",
            subTitle: "(00h-8h30)",
         },
         {
            title: "Journée",
            subTitle: "(08h30-18h30)",
         },
         {
            title: "Soirée",
            subTitle: "(18h30-22h)",
         },
         {
            title: "Nuit",
            subTitle: "(22h-00h)",
         },
      ],
   },
}

const getSituationDate = dateStr => {
   if (!frenchPublicHoliday) {
      console.warn("Les jours fériés n'ont pas été rapatriés")
   } else if (frenchPublicHoliday.includes(dateStr)) {
      return "sunday"
   }

   const dayInt = moment(dateStr).day()
   switch (dayInt) {
      case 0:
         return "sunday"
      case 6:
         return "saturday"
      default:
         return "week"
   }
}

export { profileValues, periodOfDayValues, getSituationDate, getProfiledBlocks, runProfiledValidation }
