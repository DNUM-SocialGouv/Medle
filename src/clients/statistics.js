import { saveAs } from "file-saver"
import fetch from "isomorphic-unfetch"
import moize from "moize"

import {
  API_URL,
  DEACEASED_STATISTICS_ENDPOINT,
  GLOBAL_STATISTICS_ENDPOINT,
  LIVING_STATISTICS_ENDPOINT,
} from "../config"
import { ISO_DATE, now } from "../utils/date"
import { handleAPIResponse } from "../utils/errors"
import { METHOD_POST } from "../utils/http"

const endpoints = {
  Vivant: LIVING_STATISTICS_ENDPOINT,
  Thanato: DEACEASED_STATISTICS_ENDPOINT,
}

const endpoint = (type) => endpoints[type] || GLOBAL_STATISTICS_ENDPOINT

// handy skeleton structure to avoid future "undefined" management
const statisticsDefault = {
  inputs: {},
  globalCount: 0,
  averageCount: 0,
  profilesDistribution: {}, // nested object can't be merged in JS so empty object is enough
  actsWithSamePV: 0,
  averageWithSamePV: 0,
  actsWithPv: {},
  actTypes: {},
  hours: {},
  examinations: {},
}

const defaultStartDate = now().dayOfYear(1).format(ISO_DATE)

const fetchStatistics = async ({
  type = "Global",
  scopeFilter = [],
  startDate = defaultStartDate,
  endDate = now().format(ISO_DATE),
  profile,
  authHeaders,
}) => {
  const response = await fetch(API_URL + endpoint(type), {
    method: METHOD_POST,
    body: JSON.stringify({ startDate, endDate, scopeFilter, profile }),
    headers: { "Content-Type": "application/json", ...authHeaders },
  })

  const statistics = await handleAPIResponse(response)

  return { ...statisticsDefault, ...statistics }
}

const MAX_AGE = 1000 * 60 * 5 // five minutes;

export const memoizedFetchStatistics = moize({ maxAge: MAX_AGE, isDeepEqual: true })(fetchStatistics)

export const fetchExport = async ({ type, startDate, endDate, scopeFilter = [], profile }) => {
  saveAs(
    `${API_URL}${endpoint(type)}/export?startDate=${startDate}&endDate=${endDate}&scopeFilter=${JSON.stringify(
      scopeFilter
    )}&profile=${profile}`
  )
}
