import getConfig from "next/config"
const { publicRuntimeConfig } = getConfig()

export const logError = (...message) => console.error(...message)
export const logInfo = (...message) => console.info(...message)
export const logWarning = (...message) => console.warning(...message)

export const logDebug = (...message) => {
   if (publicRuntimeConfig.DEBUG_MODE && publicRuntimeConfig.DEBUG_MODE === "true") {
      console.info(...message)
   }
}
