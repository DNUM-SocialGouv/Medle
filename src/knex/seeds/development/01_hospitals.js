exports.seed = function (knex) {
  return knex("hospitals")
    .del()
    .then(function () {
      return knex("hospitals").insert([
        {
          id: 1,
          finesse_number: "370000481",
          name: "CHRU de Tours",
          addr1: "2 BD TONNELLE",
          addr2: "",
          town: "Tours",
          postal_code: "37044",
          dep_code: "37",
          extra_data: { canDoPostMortem: true },
        },
        {
          id: 2,
          finesse_number: "450000088",
          name: "CHR d'Orléans",
          addr1: "14 AV DE L'HOPITAL",
          addr2: "CS 86709",
          town: "Orléans",
          postal_code: "45067",
          dep_code: "45",
        },
        {
          id: 3,
          finesse_number: "440000289",
          name: "CHU de Nantes",
          addr1: "7 ALL DE L'ILE GLORIETTE",
          addr2: "BP 1005",
          town: "Nantes",
          postal_code: "44093",
          dep_code: "44",
        },
        {
          id: 4,
          finesse_number: "490000031",
          name: "CHU d'Angers",
          addr1: "4 R LARREY",
          addr2: "",
          town: "Angers",
          postal_code: "49933",
          dep_code: "49",
        },
      ])
    })
  // .then(function () {
  //   return knex.raw(
  //     "select pg_catalog.setval(pg_get_serial_sequence('hospitals', 'id'), (select max(id) from hospitals) + 1);"
  //   )
  // })
}
