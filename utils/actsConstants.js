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
   { title: "Attentat", subValues: ["toto", "titi"] },
]

const examinedPersonGenderValues = ["Féminin", "Masculin", "Autre"]

const examinedPersonAgeValues = ["0-3 ans", "3-18 ans", "Adulte majeur"]

const periodOfDayValues = {
   week: {
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
            subTitle: "(18h-22h)",
         },
         {
            title: "Nuit",
            subTitle: "(22h-00h)",
         },
      ],

      dutyDoctorOnly: false,
   },
   sunday: {
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
   publicHoliday: {
      period: [
         {
            title: "Journée",
            subTitle: "(08h30-18h)",
         },
         {
            title: "Soirée",
            subTitle: "(18h-22h)",
         },
         {
            title: "Nuit profonde",
            subTitle: "(22h-08h)",
         },
      ],

      dutyDoctorOnly: false,
   },
}

const doctorWorkFormatValues = ["Médecin de garde", "Médecin d'astreinte", "Demie garde", "Demie astreinte"]

export {
   examinedPersonTypeValues,
   examinationTypeValues,
   violenceTypeValues,
   examinedPersonGenderValues,
   examinedPersonAgeValues,
   periodOfDayValues,
   doctorWorkFormatValues,
}
