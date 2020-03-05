import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig() || {}

// Timeout config : keep this timeout values in sync
export const timeout = {
   jwt: "7h",
   cookie: 7 * 60 * 60,
   session: { hours: 7 },
}

export const API_URL = publicRuntimeConfig ? publicRuntimeConfig.API_URL : "http://localhost:3000"
export const ACT_DECLARATION_ENDPOINT = "/actDeclaration"
export const ACT_SEARCH_ENDPOINT = "/acts/search"
export const ACT_DETAIL_ENDPOINT = "/actDetail"
export const ACT_DELETE_ENDPOINT = "/actDelete"
export const ACT_EDIT_ENDPOINT = "/actEdit"
export const ASKERS_SEARCH_ENDPOINT = "/askers/search"
export const ASKERS_VIEW_ENDPOINT = "/askers"
export const LOGIN_ENDPOINT = "/login"
export const LOGOUT_ENDPOINT = "/logout"
export const EMPLOYMENTS_ENDPOINT = "/employments"
export const ATTACKS_ENDPOINT = "/attacks"
export const GLOBAL_STATISTICS_ENDPOINT = "/statistics/global"
export const LIVING_STATISTICS_ENDPOINT = "/statistics/living"
export const DEACEASED_STATISTICS_ENDPOINT = "/statistics/deceased"
