import { useState } from "react"
import { logError } from "./logger"

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
   * @param {string} search
   * @param {number} requestedPage
   */
  const fetchPage = search => async requestedPage => {
    setLoading(true)
    setError(false)

    try {
      const paginatedData = await fetchData({ search, requestedPage })
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
