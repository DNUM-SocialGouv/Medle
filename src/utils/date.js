import getConfig from "next/config"
import moment from "moment"

const { publicRuntimeConfig } = getConfig()

export const FORMAT_DATE = "DD/MM/YYYY"

const testCurrentDate = publicRuntimeConfig.TEST_CURRENT_DATE

export const now = () => {
   console.log("testCurrentDate", testCurrentDate)
   return testCurrentDate ? moment(testCurrentDate, FORMAT_DATE) : moment()
}
