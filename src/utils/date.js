import getConfig from "next/config"
import moment from "moment"

const { publicRuntimeConfig } = getConfig()

export const FORMAT_DATE = "DD/MM/YYYY"
export const ISO_DATE = "YYYY-MM-DD"

const testCurrentDate = publicRuntimeConfig.TEST_CURRENT_DATE

export const now = () => {
   return testCurrentDate ? moment(testCurrentDate, FORMAT_DATE) : moment()
}
