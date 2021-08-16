import Excel from "exceljs"
import * as yup from "yup"

import knex from "../../knex/knex"
import { hospitalsOfUser } from "../../services/hospitals"
import { normalize } from "../../services/normalize"
import { ISO_DATE, now } from "../../utils/date"

const exportParamsSchema = yup.object().shape({
  currentUser: yup.object(),
  hospitals: yup.array().of(yup.number().positive().integer()),
  year: yup.number().integer().positive(),
})

async function normalizeParams(params, currentUser) {
  const authorizedHospitals = (await hospitalsOfUser(currentUser)).map((hospital) => hospital.id)

  params.hospitals =
    params.hospitals
      ?.split(",")
      .map(Number)
      .filter((hospital) => authorizedHospitals.includes(hospital)) || []

  return normalize(exportParamsSchema)(params)
}

async function findEmployments({ year, hospitals }) {
  const employments = await knex("employments")
    .join("hospitals", "hospitals.id", "employments.hospital_id")
    .whereNull("employments.deleted_at")
    .where("year", year)
    .whereIn("hospital_id", hospitals)
    .select("year", "month", "hospital_id", "hospitals.name", "data_month")
    .orderBy(["hospital_id", { column: "year", order: "desc" }, { column: "month", order: "desc" }])

  return employments || []
}

async function findReferenceEmployments({ year, hospitals }) {
  const references = await knex("employments_references")
    .join("hospitals", "hospitals.id", "employments_references.hospital_id")
    .whereNull("employments_references.deleted_at")
    .where("year", year)
    .whereIn("hospital_id", hospitals)
    .select("year", "month", "hospital_id", "hospitals.name", "reference")
    .orderBy(["hospital_id", { column: "year", order: "desc" }, { column: "month", order: "desc" }])

  return references || []
}

function parse({ data_month, ...rest }) {
  const model = {
    auditoriumAgents: 0,
    doctors: 0,
    executives: 0,
    ides: 0,
    nursings: 0,
    others: 0,
    secretaries: 0,
  }
  return { ...rest, ...model, ...data_month }
}

function parseReference({ reference, ...rest }) {
  const model = {
    auditoriumAgents: 0,
    doctors: 0,
    executives: 0,
    ides: 0,
    nursings: 0,
    others: 0,
    secretaries: 0,
  }
  return { ...rest, ...model, ...reference }
}

export const exportEmployments = async (params, currentUser) => {
  params = await normalizeParams(params, currentUser)

  const elements = await findEmployments(params)
  const references = await findReferenceEmployments(params)

  const workbook = new Excel.Workbook()

  workbook.created = now()
  workbook.modified = now()
  workbook.creator = currentUser?.email

  const worksheet = workbook.addWorksheet("ETP")

  const centerAlignment = { alignment: { horizontal: "center", vertical: "middle" } }

  worksheet.columns = [
    { header: "Année", key: "year", style: centerAlignment, width: 10 },
    { header: "Mois", key: "month", style: centerAlignment, width: 10 },
    {
      header: "Id étab.",
      key: "hospital_id",
      style: centerAlignment,
      width: 10,
    },
    {
      header: "Nom établissement",
      key: "name",
      style: centerAlignment,
      width: 25,
    },
    {
      header: "Médecins",
      key: "doctors",
      style: centerAlignment,
      width: 15,
    },
    {
      header: "Secrétaires",
      key: "secretaries",
      style: centerAlignment,
      width: 15,
    },
    {
      header: "Aide soignant·e",
      key: "nursings",
      style: centerAlignment,
      width: 15,
    },
    {
      header: "Cadre de santé",
      key: "executives",
      style: centerAlignment,
      width: 15,
    },
    { header: "IDE", key: "ides", style: centerAlignment, width: 15 },
    {
      header: "Agent d'amphi.",
      key: "auditoriumAgents",
      style: centerAlignment,
      width: 15,
    },
    { header: "Autres", key: "others", style: centerAlignment, width: 15 },
  ]

  if (elements?.length) elements.forEach((element) => worksheet.addRow(parse(element)))
  const referencesWorksheet = workbook.addWorksheet("ETP de référence")

  referencesWorksheet.columns = [
    { header: "Année", key: "year", style: centerAlignment, width: 10 },
    { header: "Mois", key: "month", style: centerAlignment, width: 10 },
    {
      header: "Id étab.",
      key: "hospital_id",
      style: centerAlignment,
      width: 10,
    },
    {
      header: "Nom établissement",
      key: "name",
      style: centerAlignment,
      width: 25,
    },
    {
      header: "Médecins",
      key: "doctors",
      style: centerAlignment,
      width: 15,
    },
    {
      header: "Secrétaires",
      key: "secretaries",
      style: centerAlignment,
      width: 15,
    },
    {
      header: "Aide soignant·e",
      key: "nursings",
      style: centerAlignment,
      width: 15,
    },
    {
      header: "Cadre de santé",
      key: "executives",
      style: centerAlignment,
      width: 15,
    },
    { header: "IDE", key: "ides", style: centerAlignment, width: 15 },
    {
      header: "Agent d'amphi.",
      key: "auditoriumAgents",
      style: centerAlignment,
      width: 15,
    },
    { header: "Autres", key: "others", style: centerAlignment, width: 15 },
  ]

  if (references?.length) references.forEach((reference) => referencesWorksheet.addRow(parseReference(reference)))

  const inputsWorksheet = workbook.addWorksheet("Paramètres de l'export")
  inputsWorksheet.columns = [
    { header: "Paramètre", key: "name", width: 40 },
    { header: "Valeur", key: "value", width: 50 },
  ]

  inputsWorksheet.addRow({ name: "Date de l'export", value: now()?.format(ISO_DATE) })
  inputsWorksheet.addRow({})
  inputsWorksheet.addRow({ name: "Année", value: params?.year })
  inputsWorksheet.addRow({ name: "Hôpitaux", value: params?.hospitals })

  return workbook
}
