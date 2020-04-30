import getConfig from "next/config"
import moment from "moment"

import { logError } from "../utils/logger"

const { publicRuntimeConfig } = getConfig() || {}

export const FORMAT_DATE = "DD/MM/YYYY"
export const ISO_DATE = "YYYY-MM-DD"

const testCurrentDate = (publicRuntimeConfig && publicRuntimeConfig.TEST_CURRENT_DATE) || false

export const now = () => (testCurrentDate && moment(testCurrentDate, FORMAT_DATE)) || moment()

export const frToIso = date => {
  const parts = date.split("/")

  if (parts.length !== 3) {
    logError("Problème de parsing de date")
    return date
  }
  const [day, month, year] = parts
  return `${year}-${month}-${day}`
}

export const isoToFr = date => {
  const parts = date.split("-")

  if (parts.length !== 3) {
    logError("Problème de parsing de date")
    return date
  }
  const [year, month, day] = parts
  return `${day}/${month}/${year}`
}
