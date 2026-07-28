import moment from "moment"

import { ISO_TIME } from "./date"

export const logError = (...message) => console.error(moment().format(ISO_TIME), ...message)
export const logInfo = (...message) => console.info(...message)
export const logWarning = (...message) => console.warning(...message)
export const logAudit = (...message) => console.info(`[Audit] ${moment().format(ISO_TIME)} ${message}`)

export const logDebug = (...message) => {
  if (process.env.DEBUG_MODE === "true") {
    console.info("debug:", ...message)
  }
}
