import Excel from "exceljs"

import { ISO_DATE, now } from "../../utils/date"
import { searchForExport } from "./search"

export const exportActs = async (params, currentUser) => {
  const { elements } = await searchForExport(params, currentUser)

  const workbook = new Excel.Workbook()

  workbook.created = now()
  workbook.modified = now()

  const worksheet = workbook.addWorksheet("Onglet 1")

  worksheet.columns = [
    { header: "Id", key: "id", width: 10 },
    { header: "Numéro interne", key: "internalNumber", width: 20 },
    { header: "Numéro réquisition", key: "pvNumber", width: 20 },
    { header: "Demandeur", key: "asker", width: 40 },
    { header: "Profil", key: "profile", width: 20 },
    { header: "Date d'examen", key: "examinationDate", width: 20 },
    { header: "Auteur", key: "user", width: 20 },
    { header: "Hôpital", key: "hospital", width: 20 },
    { header: "Types d'examen", key: "examinationTypes", width: 60 },
    { header: "Examens", key: "examinations", width: 60 },
    { header: "Genre personne", key: "personGender", width: 20 },
    { header: "Âge personne", key: "personAgeTag", width: 20 },
    { header: "Horaire", key: "periodOfDay", width: 20 },
    { header: "Lieu", key: "location", width: 40 },
    { header: "Nature violences", key: "violenceNatures", width: 60 },
    { header: "Contexte violences", key: "violenceContexts", width: 40 },
    { header: "Durée", key: "duration", width: 20 },
    { header: "Distance", key: "distance", width: 20 },
    { header: "Cause du décès", key: "deathCause", width: 20 },
  ]

  if (elements?.length) elements.forEach((element) => worksheet.addRow(element))

  const inputsWorksheet = workbook.addWorksheet("Paramètres de l'export")
  inputsWorksheet.columns = [
    { header: "Paramètre", key: "name", width: 40 },
    { header: "Valeur", key: "value", width: 80 },
  ]

  inputsWorksheet.addRow({ name: "Date de l'export", value: now()?.format(ISO_DATE) })
  inputsWorksheet.addRow({})
  inputsWorksheet.addRow({ name: "Champ n°", value: params?.fuzzy })
  inputsWorksheet.addRow({ name: "Date de début", value: params?.startDate })
  inputsWorksheet.addRow({ name: "Date de fin", value: params?.endDate })
  inputsWorksheet.addRow({ name: "Établissements", value: params?.hospitals })
  inputsWorksheet.addRow({ name: "Profils", value: params?.profiles })
  inputsWorksheet.addRow({ name: "Demandeur", value: params?.asker })
  inputsWorksheet.addRow({})
  inputsWorksheet.addRow({ name: "Hôpital de l'utilisateur", value: (currentUser?.hospital?.id || "").toString() })
  inputsWorksheet.addRow({ name: "Périmètre de l'utilisateur", value: currentUser?.scope || [] })

  return workbook
}
