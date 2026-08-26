export const START_YEAR_MEDLE = 2020

export const LIMIT_EXPORT = 150000

const FEATURE_FLAGS = {
  administration: true,
  directory: false,
  export: true,
  notification: false,
  resources: false,
}

const DEFAULT_API_URL = "/api"

const isAbsoluteUrl = (url) => /^https?:\/\//.test(url)

const buildServerApiUrl = () => {
  const apiUrl = process.env.API_URL || DEFAULT_API_URL

  if (isAbsoluteUrl(apiUrl)) {
    return apiUrl
  }

  const appBaseUrl = process.env.APP_BASE_URL || "http://localhost:3000"
  const normalizedApiUrl = apiUrl.startsWith("/") ? apiUrl : `/${apiUrl}`

  return `${appBaseUrl}${normalizedApiUrl}`
}

const buildApiUrl = () => {
  if (typeof window !== "undefined") {
    return DEFAULT_API_URL
  }

  return buildServerApiUrl()
}

const authDuration = process.env.NEXT_PUBLIC_AUTH_DURATION
const authRefreshStart = process.env.NEXT_PUBLIC_AUTH_REFRESH_START
const authMaxDuration = process.env.NEXT_PUBLIC_AUTH_MAX_DURATION

// Timeout (in seconds) config : keep this timeout values in sync (30 minutes by default)
export const timeoutConfig =
  Number.isInteger(Number.parseInt(authDuration)) &&
  Number.isInteger(Number.parseInt(authRefreshStart)) &&
  Number.isInteger(Number.parseInt(authMaxDuration))
    ? {
        cookie: Number.parseInt(authDuration),
        jwt: Number.parseInt(authDuration),
        session: { seconds: Number.parseInt(authDuration) },
        authRefreshStart: { seconds: Number.parseInt(authRefreshStart) },
        authMaxDuration: { seconds: Number.parseInt(authMaxDuration) },
      }
    : {
        cookie: 1800,
        jwt: 1800,
        session: { seconds: 1800 },
        authRefreshStart: { seconds: 1500 },
        authMaxDuration: { seconds: 18000 },
      }

export const API_URL = buildApiUrl()

export const isOpenFeature = (feature) => {
  return !!FEATURE_FLAGS[feature]
}

export const LOGIN_ENDPOINT = "/login"
export const LOGOUT_ENDPOINT = "/logout"
export const REFRESH_TOKEN_ENDPOINT = "/refresh-token"
export const RESET_PWD_ENDPOINT = "/reset-password"
export const FORGOT_PWD_ENDPOINT = "/forgot-password"

export const ACTS_ENDPOINT = "/acts"
export const LOCATIONS_ENDPOINT = "/locations"
export const ACTS_SUMMARY_ENDPOINT = "/acts-summary"
export const ASKERS_ENDPOINT = "/askers"
export const EMPLOYMENTS_ENDPOINT = "/employments"
export const ATTACKS_ENDPOINT = "/attacks"
export const HOSPITALS_ENDPOINT = "/hospitals"
export const USERS_ENDPOINT = "/users"
export const APP_SETTINGS_ENDPOINT = "/app-settings"

export const GLOBAL_STATISTICS_ENDPOINT = "/statistics/global"
export const LIVING_STATISTICS_ENDPOINT = "/statistics/living"
export const DEACEASED_STATISTICS_ENDPOINT = "/statistics/deceased"

export const MESSAGES_ENDPOINT = "/messages"
export const LOGOS_ENDPOINT = "/logos"
export const FOOTER_DOCUMENTS_ENDPOINT = "/footer-documents"
