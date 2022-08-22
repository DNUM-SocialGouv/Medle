import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig() || {}

export const START_YEAR_MEDLE = 2020

export const LIMIT_EXPORT = 10000

// Timeout (in minutes) config : keep this timeout values in sync
export const timeout = publicRuntimeConfig
  ? {
      cookie: publicRuntimeConfig.AUTHENTICATION_TTL * 60,
      jwt: publicRuntimeConfig.AUTHENTICATION_TTL + "m",
      session: { minutes: publicRuntimeConfig.AUTHENTICATION_TTL },
    }
  : {
      cookie: 30 * 60,
      jwt: "30m",
      session: { minutes: 30 },
    }

export const API_URL = publicRuntimeConfig ? publicRuntimeConfig.API_URL : "http://localhost:3000/api"

export const isOpenFeature = (feature) => {
  const flags = publicRuntimeConfig?.FEATURE_FLAGS || {}
  return !!flags[feature]
}

export const LOGIN_ENDPOINT = "/login"
export const LOGOUT_ENDPOINT = "/logout"
export const RESET_PWD_ENDPOINT = "/reset-password"
export const FORGOT_PWD_ENDPOINT = "/forgot-password"

export const ACTS_ENDPOINT = "/acts"
export const ASKERS_ENDPOINT = "/askers"
export const EMPLOYMENTS_ENDPOINT = "/employments"
export const ATTACKS_ENDPOINT = "/attacks"
export const HOSPITALS_ENDPOINT = "/hospitals"
export const USERS_ENDPOINT = "/users"

export const GLOBAL_STATISTICS_ENDPOINT = "/statistics/global"
export const LIVING_STATISTICS_ENDPOINT = "/statistics/living"
export const DEACEASED_STATISTICS_ENDPOINT = "/statistics/deceased"

export const MESSAGES_ENDPOINT = "/messages"
export const LOGOS_ENDPOINT = "/logos"
export const FOOTER_DOCUMENTS_ENDPOINT = "/footer-documents"
