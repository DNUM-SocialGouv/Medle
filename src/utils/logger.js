import moment from "moment"
import getConfig from "next/config"

import { ISO_TIME } from "./date"

const { publicRuntimeConfig } = getConfig() || {}

export const logError = (...message) => console.error(moment().format(ISO_TIME), ...message)
export const logInfo = (...message) => console.info(...message)
export const logWarning = (...message) => console.warning(...message)

export const logDebug = (...message) => {
  if (publicRuntimeConfig && publicRuntimeConfig.DEBUG_MODE && publicRuntimeConfig.DEBUG_MODE === "true") {
    console.info("debug:", ...message)
  }
}
