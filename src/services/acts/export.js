import Excel from "exceljs"
import { now } from "../../utils/date"
import { searchForExport } from "./search"

export const exportActs = async ({ fuzzy, internalNumber, pvNumber, requestedPage }, currentUser) => {
  const { elements } = await searchForExport({ fuzzy, internalNumber, pvNumber, requestedPage }, currentUser)

  const workbook = new Excel.Workbook()

  workbook.created = now()
  workbook.modified = now()

  const worksheet = workbook.addWorksheet("Onglet 1")

  worksheet.columns = [
    { header: "Id", key: "id", width: 10 },
    { header: "Numéro interne", key: "internalNumber", width: 20 },
    { header: "Numéro réquisition", key: "pvNumber", width: 20 },
    { header: "Demandeur", key: "asker", width: 20 },
    { header: "Profil", key: "profile", width: 20 },
    { header: "Date d'examen", key: "examinationDate", width: 20 },
    { header: "Auteur", key: "user", width: 20 },
    { header: "Hôpital", key: "hospital", width: 20 },
    { header: "Types d'examen", key: "examinationTypes", width: 60 },
    { header: "Examens", key: "examinations", width: 60 },
    { header: "Genre personne", key: "personGender", width: 20 },
    { header: "Âge personne", key: "personAgeTag", width: 20 },
    { header: "Horaire", key: "periodOfDay", width: 20 },
    { header: "Lieu", key: "location", width: 60 },
    { header: "Nature violences", key: "violenceNatures", width: 60 },
    { header: "Contexte violences", key: "violenceContexts", width: 60 },
    { header: "Durée", key: "duration", width: 20 },
    { header: "Distance", key: "distance", width: 20 },
  ]

  if (elements?.length) elements.forEach((element) => worksheet.addRow(element))

  return workbook
}
