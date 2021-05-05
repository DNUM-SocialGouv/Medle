import joursFeries from "@socialgouv/jours-feries"
import moment from "moment"

import AsylumSeekerProfile from "../components/profiles/AsylumSeekerProfile"
import BoneAgeProfile from "../components/profiles/BoneAgeProfile"
import CriminalCourtProfile from "../components/profiles/CriminalCourtProfile"
import CustodyProfile from "../components/profiles/CustodyProfile"
import DeceasedProfile from "../components/profiles/DeceasedProfile"
import DrunkProfile from "../components/profiles/DrunkProfile"
import FileStudyProfile from "../components/profiles/FileStudyProfile"
import ReconstitutionProfile from "../components/profiles/ReconstitutionProfile"
import RestrainedProfile from "../components/profiles/RestrainedProfile"
import RoadRelatedExaminationProfile from "../components/profiles/RoadRelatedExaminationProfile"
import VictimProfile from "../components/profiles/VictimProfile"
import { ISO_DATE } from "./date"

export const orderedProfileValues = [
  "Victime (vivante)",
  "Gardé.e à vue",
  "Personne pour âge osseux (hors GAV)",
  "Examen pour OFPRA",
  "Personne décédée",
  {
    subValues: ["Personne retenue", "Examen lié à la route", "IPM", "Assises", "Reconstitution", "Étude de dossier"],
    title: "Autre activité",
  },
]

export const profiles = {
  "Autre activité/Assises": CriminalCourtProfile,
  "Autre activité/Examen lié à la route": RoadRelatedExaminationProfile,
  "Autre activité/IPM": DrunkProfile,
  "Autre activité/Personne retenue": RestrainedProfile,
  "Autre activité/Reconstitution": ReconstitutionProfile,
  "Autre activité/Étude de dossier": FileStudyProfile,
  "Examen pour OFPRA": AsylumSeekerProfile,
  "Gardé.e à vue": CustodyProfile,
  "Personne décédée": DeceasedProfile,
  "Personne pour âge osseux (hors GAV)": BoneAgeProfile,
  "Victime (vivante)": VictimProfile,
}

export const livingProfiles = [
  { label: "Victime", value: "Victime (vivante)" },
  { label: "Gardé.e à vue", value: "Gardé.e à vue" },
  { label: "Personne pour âge osseux", value: "Personne pour âge osseux (hors GAV)" },
  { label: "Examen pour OFPRA", value: "Examen pour OFPRA" },
  { label: "Personne retenue", value: "Autre activité/Personne retenue" },
  { label: "Examen lié à la route", value: "Autre activité/Examen lié à la route" },
  { label: "IPM", value: "Autre activité/IPM" },
  { label: "Étude de dossier", value: "Autre activité/Étude de dossier" },
]

const periodOfDayValues = {
  saturday: {
    period: [
      {
        subTitle: "(00h-8h30)",
        title: "Nuit profonde",
      },
      {
        subTitle: "(8h30-12h30)",
        title: "Matin",
      },
      {
        subTitle: "(12h30-18h)",
        title: "Après-midi",
      },
      {
        subTitle: "(18h-00h)",
        title: "Soirée",
      },
    ],
    title: "sam.",
  },
  sunday: {
    period: [
      {
        subTitle: "(00h-8h30)",
        title: "Nuit profonde",
      },
      {
        subTitle: "(08h30-18h30)",
        title: "Journée",
      },
      {
        subTitle: "(18h30-00h)",
        title: "Soirée",
      },
    ],
    title: "dim. et férié",
  },
  week: {
    period: [
      {
        subTitle: "(00h-8h30)",
        title: "Nuit profonde",
      },
      {
        subTitle: "(8h30-18h30)",
        title: "Journée",
      },
      {
        subTitle: "(18h30-00h)",
        title: "Soirée",
      },
    ],
    title: "lun.-ven.",
  },
}

const getSituationDate = (dateStr) => {
  const publicHolidays = joursFeries(moment(dateStr).format("YYYY"))

  const publicHolidaysDates = Object.values(publicHolidays).map((elt) => moment(elt).format(ISO_DATE))

  if (publicHolidaysDates.includes(dateStr)) {
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

export { getSituationDate, periodOfDayValues }
