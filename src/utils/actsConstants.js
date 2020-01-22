import moment from "moment"
import joursFeries from "@socialgouv/jours-feries"
import AsylumSeekerProfile from "../components/profiles/AsylumSeekerProfile"
import BoneAgeProfile from "../components/profiles/BoneAgeProfile"
import CriminalCourtProfile from "../components/profiles/CriminalCourtProfile"
import CustodyProfile from "../components/profiles/CustodyProfile"
import DeceasedProfile from "../components/profiles/DeceasedProfile"
import DrunkProfile from "../components/profiles/DrunkProfile"
import ReconstitutionProfile from "../components/profiles/ReconstitutionProfile"
import RestrainedProfile from "../components/profiles/RestrainedProfile"
import RoadRelatedExaminationProfile from "../components/profiles/RoadRelatedExaminationProfile"
import VictimProfile from "../components/profiles/VictimProfile"

export const orderedProfileValues = [
   "Victime (vivante)",
   "Gardé.e à vue",
   "Personne pour âge osseux (hors GAV)",
   "Examen pour OFPRA",
   "Personne décédée",
   {
      title: "Autre activité",
      subValues: ["Personne retenue", "Examen lié à la route", "IPM", "Assises", "Reconstitution"],
   },
]

export const profiles = {
   "Victime (vivante)": VictimProfile,
   "Personne décédée": DeceasedProfile,
   "Gardé.e à vue": CustodyProfile,
   "Personne pour âge osseux (hors GAV)": BoneAgeProfile,
   "Examen pour OFPRA": AsylumSeekerProfile,
   "Autre activité/Personne retenue": RestrainedProfile,
   "Autre activité/Examen lié à la route": RoadRelatedExaminationProfile,
   "Autre activité/IPM": DrunkProfile,
   "Autre activité/Assises": CriminalCourtProfile,
   "Autre activité/Reconstitution": ReconstitutionProfile,
}

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
            subTitle: "(18h30-00h)",
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
            title: "Soirée",
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
            subTitle: "(18h30-00h)",
         },
      ],
   },
}

const getSituationDate = dateStr => {
   const publicHolidays = joursFeries(moment(dateStr).format("YYYY"))

   const allDates = Object.values(publicHolidays).map(elt => moment(elt).format("YYYY-MM-DD"))

   if (allDates.includes(dateStr)) {
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

export { periodOfDayValues, getSituationDate }
