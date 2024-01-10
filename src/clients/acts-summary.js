import { ACTS_SUMMARY_ENDPOINT, API_URL } from "../config"
import { handleAPIResponse2 } from "../utils/errors"

export const findSummaryByHospital = async ({  hospitalId, headers }) => {
    const response = await fetch(`${API_URL}${ACTS_SUMMARY_ENDPOINT}?hospitals=${hospitalId}`, {
      headers: { ...headers, "Content-Type": "application/json" },
    })
  
    const { elements } = await handleAPIResponse2(response)
    return elements
  }

  export const fetchExport = async (selectedYear, hospitalId, headers) => {
    saveAs(`${API_URL}${ACTS_SUMMARY_ENDPOINT}/export?hospitals=${hospitalId}&year=${selectedYear}`, { ...headers })
  }
