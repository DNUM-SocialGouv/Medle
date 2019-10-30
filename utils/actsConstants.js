const examinedPersonValues = [
   "Victime",
   "Garde à vue",
   "Mort",
   { name: "Pas d'examens", values: ["Assises", "Reconstitution", "Expertise"] },
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
   { name: "Attentat", children: ["toto", "titi"] },
]

const examinedPersonGenderValues = ["Féminin", "Masculin", "Autre"]

const examinedPersonAge = ["0-3 ans", "3-18 ans", "Adulte majeur"]

export {
   examinedPersonValues,
   examinationTypeValues,
   violenceTypeValues,
   examinedPersonGenderValues,
   examinedPersonAge,
}
