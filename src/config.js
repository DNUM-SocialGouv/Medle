import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig() || {}

// Timeout config : keep this timeout values in sync
export const timeout = {
    jwt: "9h",
    cookie: 9 * 60 * 60,
    session: { hours: 9 },
}

export const API_URL = publicRuntimeConfig ? publicRuntimeConfig.API_URL : "http://localhost:3000/api"

export const isOpenFeature = (feature) => {
    const flags = publicRuntimeConfig?.FEATURE_FLAGS || {}
    return !!flags[feature]
}

export const LOGIN_ENDPOINT = "/login"
export const LOGOUT_ENDPOINT = "/logout"
export const RESET_PWD_ENDPOINT = "/reset"

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
