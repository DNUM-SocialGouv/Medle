const formats = [
   {
      name: "Victime",
      version: 1,
      edition: [
         {
            name: "examinationTypes",
            title: "Type(s) d'examen(s)",
            values: ["Somatique", "Psychiatrique", "Psychologique"],
            mandatory: true,
            type: "button",
            optionsType: ["multi"],
            errorValidation: "Obligatoire",
         },
         {
            name: "violenceTypes",
            title: "Type(s) de violence",
            values: [
               "Conjuguale",
               "Urbaine",
               "En réunion",
               "Scolaire",
               "Familiale",
               "Sur ascendant",
               "Agression sexuelle",
               { title: "Attentat", subValues: ["Bataclan", "Hyper Cacher"] },
            ],
            mandatory: true,
            type: "button",
            optionsType: ["multi"],
            errorValidation: "Obligatoire",
         },
         {
            name: "",
         },
      ],
   },
]
