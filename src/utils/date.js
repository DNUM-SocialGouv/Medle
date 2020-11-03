import getConfig from "next/config"
import moment from "moment"

import { logError } from "../utils/logger"

const { publicRuntimeConfig } = getConfig() || {}

export const NAME_MONTHS = {
  "01": "janvier",
  "02": "février",
  "03": "mars",
  "04": "avril",
  "05": "mai",
  "06": "juin",
  "07": "juillet",
  "08": "août",
  "09": "septembre",
  "10": "octobre",
  "11": "novembre",
  "12": "décembre",
}

export const FORMAT_DATE = "DD/MM/YYYY"
export const ISO_DATE = "YYYY-MM-DD"
export const ISO_TIME = "YYYY-MM-DDTHH:mm:ssZ"

export const now = () =>
  (publicRuntimeConfig?.TEST_CURRENT_DATE && moment(publicRuntimeConfig?.TEST_CURRENT_DATE, FORMAT_DATE)) || moment()

export const isValidIsoDate = (date) => date && moment(date, ISO_DATE, true).isValid()

export const frToIso = (date) => {
  const parts = date.split("/")

  if (parts.length !== 3) {
    logError("Problème de parsing de date")
    return date
  }
  const [day, month, year] = parts
  return `${year}-${month}-${day}`
}

export const isoToFr = (date) => {
  const parts = date.split("-")

  if (parts.length !== 3) {
    logError("Problème de parsing de date")
    return date
  }
  const [year, month, day] = parts
  return `${day}/${month}/${year}`
}
