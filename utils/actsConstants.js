import moment from "moment"
import { FRENCH_PUBLIC_HOLIDAY_ENDPOINT } from "../config"

const initFetchFrenchPublicHoliday = async () => {
   const currentYear = moment().year()
   try {
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

const examinedPersonTypeValues = [
   "Victime",
   "Garde à vue",
   "Mort",
   { title: "Pas d'examens", subValues: ["Assises", "Reconstitution", "Expertise"] },
]

const examinationTypeValues = ["Somatique", "Psychiatrique", "Psychologique"]

const violenceTypeValues = [
   "Conjuguale",
   "Urbaine",
   "En réunion",
   "Scolaire",
   "Familiale",
   "Sur ascendant",
   "Agression sexuelle",
   { title: "Attentat", subValues: ["Bataclan", "Hyper Cacher"] },
]

const examinedPersonGenderValues = ["Féminin", "Masculin", "Autre"]

const examinedPersonAgeValues = ["0-3 ans", "3-18 ans", "Adulte majeur"]

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
      dutyDoctorOnly: true,
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

      dutyDoctorOnly: false,
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

      dutyDoctorOnly: false,
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
const doctorWorkFormatValues = ["Garde", "Astreinte", "Demie garde", "Demie astreinte"]
const doctorWorkFormatDefaultValues = ["Classique"]

export {
   examinedPersonTypeValues,
   examinationTypeValues,
   violenceTypeValues,
   examinedPersonGenderValues,
   examinedPersonAgeValues,
   periodOfDayValues,
   doctorWorkFormatValues,
   getSituationDate,
   doctorWorkFormatDefaultValues,
}
