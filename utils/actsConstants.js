import moment from "moment"
import { FRENCH_PUBLIC_HOLIDAY_ENDPOINT } from "../config"
import fetch from "isomorphic-unfetch"

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

const doctorWorkStatusValues = ["Garde", "Astreinte", "Demie garde"]
const doctorWorkStatusDefault = ["Classique"]

const periodOfDayValues = {
   week: {
      title: "lun.-ven.",
      period: [
         {
            title: "Nuit profonde",
            subTitle: "(00h-8h30)",
            doctorWorkStatusValues,
         },
         {
            title: "Journée",
            subTitle: "(8h30-18h30)",
            doctorWorkStatusValues: doctorWorkStatusDefault,
         },
         {
            title: "Soirée",
            subTitle: "(18h30-22h)",
            doctorWorkStatusValues: doctorWorkStatusDefault,
         },
         {
            title: "Nuit",
            subTitle: "(22h-00h)",
            doctorWorkStatusValues,
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
            doctorWorkStatusValues,
         },
         {
            title: "Matin",
            subTitle: "(8h30-12h30)",
            doctorWorkStatusValues: doctorWorkStatusDefault,
         },
         {
            title: "Après-midi",
            subTitle: "(12h30-18h)",
            doctorWorkStatusValues,
         },
         {
            title: "Soirée et nuit",
            subTitle: "(18h-00h)",
            doctorWorkStatusValues,
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
            doctorWorkStatusValues,
         },
         {
            title: "Journée",
            subTitle: "(08h30-18h30)",
            doctorWorkStatusValues,
         },
         {
            title: "Soirée",
            subTitle: "(18h30-22h)",
            doctorWorkStatusValues,
         },
         {
            title: "Nuit",
            subTitle: "(22h-00h)",
            doctorWorkStatusValues,
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

export {
   examinedPersonTypeValues,
   examinationTypeValues,
   violenceTypeValues,
   examinedPersonGenderValues,
   examinedPersonAgeValues,
   periodOfDayValues,
   doctorWorkStatusValues,
   getSituationDate,
   doctorWorkStatusDefault,
}
