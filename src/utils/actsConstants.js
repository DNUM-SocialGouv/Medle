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

export const isSubmittedActCorrect = (data) => {
  let actIsCorrect = true

  // Vérification des champs attendus
  for (const field in data) {
    if (!actFields.includes(field)) {
      actIsCorrect = false
    }
  }

  // Vérification des champs correspondant à une colonne en base
  if (data.id && !Number.isInteger(data.id)) actIsCorrect = false
  if (data.userId && !Number.isInteger(data.userId)) actIsCorrect = false
  if (data.addedBy && !Number.isInteger(data.addedBy)) actIsCorrect = false
  if (data.askerId && !Number.isInteger(data.askerId)) actIsCorrect = false
  if (data.examinationDate && !moment(data.examinationDate, "YYYY-MM-DD", true).isValid()) actIsCorrect = false
  if (data.hospitalId && !Number.isInteger(data.hospitalId)) actIsCorrect = false

  // Vérification des valeurs attendues pour chaque champ de la colonne extra_data en base
  if (data.deathCause && !actDeathCauses.includes(data.deathCause)) actIsCorrect = false
  if (data.distance && !actDistances.includes(data.distance)) actIsCorrect = false
  if (data.duration && !actDurations.includes(data.duration)) actIsCorrect = false
  if (data.examinations) {
    data.examinations.forEach((examination) => {
      if (!actExaminations.includes(examination)) actIsCorrect = false
    })
  }
  if (data.examinationTypes) {
    if (!data.examinationTypes.length > 0) actIsCorrect = false
    data.examinationTypes.forEach((types) => {
      if (!actExaminationTypes.includes(types)) actIsCorrect = false
    })
  }
  if (data.honoredMeeting && !actHonoredMeetings.includes(data.honoredMeeting)) actIsCorrect = false
  if (data.location && !actLocations.includes(data.location)) actIsCorrect = false
  if (data.periodOfDay && !actPeriodOfDays.includes(data.periodOfDay)) actIsCorrect = false
  if (data.personAgeTag && !actPersonAgeTags.includes(data.personAgeTag)) actIsCorrect = false
  if (data.personGender && !actPersonGenders.includes(data.personGender)) actIsCorrect = false
  if (data.personIsPresent && !actPersonIsPresents.includes(data.personIsPresent)) actIsCorrect = false
  if (data.profile && !actProfiles.includes(data.profile)) actIsCorrect = false
  if (data.violenceContexts) {
    if (!data.violenceContexts.length > 0) actIsCorrect = false
    data.violenceContexts.forEach((context) => {
      if (!actViolenceContexts.includes(context)) actIsCorrect = false
    })
  }
  if (data.violenceNatures) {
    if (!data.violenceNatures.length > 0) actIsCorrect = false
    data.violenceNatures.forEach((nature) => {
      if (!actViolenceNatures.includes(nature)) actIsCorrect = false
    })
  }

  return actIsCorrect
}

export const actFields = [
  "proofWithoutComplaint",
  "addedBy",
  "askerId",
  "deathCause",
  "distance",
  "duration",
  "examinationDate",
  "examinations",
  "examinationTypes",
  "honoredMeeting",
  "hospitalId",
  "id",
  "internalNumber",
  "location",
  "periodOfDay",
  "personAgeTag",
  "personGender",
  "personIsPresent",
  "profile",
  "pvNumber",
  "userId",
  "violenceContexts",
  "violenceNatures",
]

export const actDeathCauses = ["Suicide", "Suicide probable", "Autre"]

export const actDistances = ["En visio", "- de 50 km", "50 à 150 km", "+ de 150 km"]

export const actDurations = ["- de 2 heures", "2 à 4 heures", "- de 4 heures", "4 à 8 heures", "+ de 8 heures"]

export const actExaminations = [
  "Anapath",
  "Autres",
  "Biologie",
  "Génétique",
  "Imagerie",
  "Panoramique dentaire",
  "Radiographie",
  "Scanner",
  "Toxicologie",
]

export const actExaminationTypes = [
  "Anthropologie",
  "Autopsie",
  "Examen externe",
  "Levée de corps",
  "Odontologie",
  "Psychiatrique",
  "Somatique",
]

export const actHonoredMeetings = ["Oui", "Non"]

export const actLocations = [
  "Centre de rétention",
  "Commissariat",
  "Établissement pénitentiaire",
  "Gendarmerie",
  "Lieu de contrôle",
  "Locaux douaniers",
  "Maison de retraite",
  "Service d'hosp. privé",
  "Service d'hosp. public",
  "Service hosp. public",
  "Tribunal",
  "UMJ",
]

export const actPeriodOfDays = ["Nuit profonde", "Journée", "Matin", "Après-midi", "Soirée"]

export const actPersonAgeTags = ["Mineur", "Majeur", "0-2 ans", "3-6 ans", "3-17 ans", "7-17 ans", "+ de 18 ans", "Non déterminé"]

export const actPersonGenders = ["Féminin", "Masculin", "Autre genre", "Non déterminé"]

export const actPersonIsPresents = ["Oui", "Non"]

export const actProfiles = [
  "Autre activité/Assises",
  "Autre activité/Examen lié à la route",
  "Autre activité/IPM",
  "Autre activité/Personne retenue",
  "Autre activité/Reconstitution",
  "Autre activité/Étude de dossier",
  "Examen pour OFPRA",
  "Gardé.e à vue",
  "Personne décédée",
  "Personne pour âge osseux (hors GAV)",
  "Victime (vivante)",
]

export const actViolenceContexts = [
  "Conjugale",
  "Infra-familiale (hors conjugale)",
  "Travail",
  "Voie publique",
  "Autre type/Institution",
  "Autre type/Scolaire",
  "Autre type/Autre",
]

export const actViolenceNatures = [
  "Coups blessures",
  "Sexuelle",
  "Maltraitance",
  "Violence psychologique",
  "Accident/Collectif",
  "Accident/Non collectif",
  "Attentat/2020 Villejuif",
  "Attentat/2016 Nice",
  "Attentat/2015 Les terrasses Paris",
  "Attentat/2015 Bataclan",
  "Attentat/2015 Hyper Cacher",
  "Attentat/2015 Charlie Hebdo",
  "Attentat/2012 École Ozar Hatorah Toulouse",
]
