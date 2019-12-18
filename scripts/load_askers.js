// Usage:
// 0. configurer API_URL (si l'on veut comparer avec la production par exemple)
// 1. lancer ce script : node load_askers.js
// 2. dans un outil type DataGrip, faire un import vers la table askers du fichier XXX-askersToAdd.csv
// PS: Configuration DataGrip
// (Format: Comma separated, value-separator: comma, row-separator: NewLine, null-value-text: Empty string, First row is header coché, Encoding UTF-8)

const fetch = require("isomorphic-unfetch")
const fs = require("fs")
const moment = require("moment")

const API_URL = "http://localhost:3000"
const ACT_SEARCH_ENDPOINT = "/api/askers/search"

const primaryAskers = [
   "OFPRA (Office Français de Protection des Réfugiés et Apatrides)",
   "Ministère de l'intérieur",
   "Police aux frontières",
   "Brigade financière",
   "Parquet national antiterroriste",
   "Douane judiciaire",
   "CRS autoroutière",
   "Juge d'instruction",
]

const fetchAskersThirdParty = async () => {
   const fetchData = async type => {
      const response = await fetch(`http://etablissements-publics.api.gouv.fr/v3/organismes/${type}`)
      const json = await response.json()
      if (!json || !json.features || !json.features.length) return false
      return json.features[0]
         .map(elt => (elt && elt.properties && elt.properties.nom ? elt.properties.nom.trim() : false))
         .filter(x => !!x)
   }

   const getMap = ({ data, type }) => {
      return data.reduce((acc, curr) => {
         acc[curr.toUpperCase()] = { type, name: curr }
         return acc
      }, {})
   }

   const tgis = await fetchData("tgi")
   const commissariats = await fetchData("commissariat_police")
   const gendarmeries = await fetchData("gendarmerie")

   return {
      ...getMap({ data: tgis, type: "tgi" }),
      ...getMap({ data: commissariats, type: "commissariat_police" }),
      ...getMap({ data: gendarmeries, type: "gendarmerie" }),
      ...getMap({ data: primaryAskers, type: "primary" }),
   }
}

const fetchExistingAskers = async () => {
   const response = await fetch(`${API_URL}${ACT_SEARCH_ENDPOINT}`)
   const json = await response.json()

   return json.reduce((acc, curr) => {
      acc[curr.name.trim().toUpperCase()] = curr.name
      return acc
   }, {})
}

const getAskersToAdd = (newAskers, existingAskers) => {
   const askersToAdd = []
   const askersNotToAdd = []

   Object.keys(newAskers).forEach(key => {
      const candidate = existingAskers[key]
      if (!candidate) askersToAdd.push(newAskers[key])
      else askersNotToAdd.push(newAskers[key])
   })

   return { askersToAdd, askersNotToAdd }
}

Promise.all([fetchAskersThirdParty(), fetchExistingAskers()]).then(([newAskers, existingAskers]) => {
   console.log("newAskers", newAskers)
   console.log("existingAskers", existingAskers)
   const { askersToAdd, askersNotToAdd } = getAskersToAdd(newAskers, existingAskers)

   console.log("Tours newAskers", newAskers["Tribunal de grande instance de Tours".toUpperCase()])
   console.log("Tours existingAskers", existingAskers["Tribunal de grande instance de Tours".toUpperCase()])

   const formatResult = data => "name, type\n" + data.map(elt => elt.name + "," + elt.type).join("\n")

   fs.writeFile(`./data/${moment().format("YYYYMMDD-HHmmss")}-askersToAdd.csv`, formatResult(askersToAdd), function(
      err,
   ) {
      if (err) {
         return console.log(err)
      }
      console.log("The file askersToAdd.csv was saved!")
   })
   fs.writeFile(
      `./data/${moment().format("YYYYMMDD-HHmmss")}-askersNotToAdd.csv`,
      formatResult(askersNotToAdd),
      function(err) {
         if (err) {
            return console.log(err)
         }
         console.log("The file askersNotToAdd was saved!")
      },
   )
})
