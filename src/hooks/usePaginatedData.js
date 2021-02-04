import { useState } from "react"

import { logError } from "../utils/logger"

const defaultPaginatedData = {
  totalCount: 0,
  currentPage: 1,
  maxPage: 1,
  elements: [],
}

export const usePaginatedData = (fetchData, initialPaginatedData) => {
  const [paginatedData, setPaginatedData] = useState(initialPaginatedData || defaultPaginatedData)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * Curified function to fetch the data.
   *
   * Ex:
   * fetchData("my-term")(3)
   * => to have the 4th page with the keyword "my-term"
   *
   * NB: the result of the API endpoint must have a predefined shape. See defaultPaginatedData.
   *
   * @param {object} filters (object with at least search property)
   * @param {number} requestedPage
   */
  const fetchPage = (filters) => async (requestedPage) => {
    setLoading(true)
    setError(false)

    try {
      const paginatedData = await fetchData({ ...filters, requestedPage })
      setPaginatedData(paginatedData)
    } catch (error) {
      logError("APP error", error)
      setError("Erreur serveur")
    } finally {
      setTimeout(async () => {
        setLoading(false)
      }, 500)
    }
  }

  return [paginatedData, error, loading, fetchPage]
}
