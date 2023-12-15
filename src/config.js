import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig() || {}

export const START_YEAR_MEDLE = 2020

export const LIMIT_EXPORT = 150000

// Timeout (in seconds) config : keep this timeout values in sync (30 minutes by default)
export const timeoutConfig =
  Number.isInteger(Number.parseInt(publicRuntimeConfig.AUTH_DURATION)) &&
  Number.isInteger(Number.parseInt(publicRuntimeConfig.AUTH_REFRESH_START)) &&
  Number.isInteger(Number.parseInt(publicRuntimeConfig.AUTH_MAX_DURATION))
    ? {
        cookie: Number.parseInt(publicRuntimeConfig.AUTH_DURATION),
        jwt: Number.parseInt(publicRuntimeConfig.AUTH_DURATION),
        session: { seconds: Number.parseInt(publicRuntimeConfig.AUTH_DURATION) },
        authRefreshStart: { seconds: Number.parseInt(publicRuntimeConfig.AUTH_REFRESH_START) },
        authMaxDuration: { seconds: Number.parseInt(publicRuntimeConfig.AUTH_MAX_DURATION) },
      }
    : {
        cookie: 1800,
        jwt: 1800,
        session: { seconds: 1800 },
        authRefreshStart: { seconds: 1500 },
        authMaxDuration: { seconds: 18000 },
      }

export const API_URL = publicRuntimeConfig ? publicRuntimeConfig.API_URL : "http://localhost:3000/api"

export const isOpenFeature = (feature) => {
  const flags = publicRuntimeConfig?.FEATURE_FLAGS || {}
  return !!flags[feature]
}

export const LOGIN_ENDPOINT = "/login"
export const LOGOUT_ENDPOINT = "/logout"
export const REFRESH_TOKEN_ENDPOINT = "/refresh-token"
export const RESET_PWD_ENDPOINT = "/reset-password"
export const FORGOT_PWD_ENDPOINT = "/forgot-password"

export const ACTS_ENDPOINT = "/acts"
export const ACTS_SUMMARY_ENDPOINT = "/acts-summary"
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
