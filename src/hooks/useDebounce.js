import React from "react"

/**
 * Debounce allows to prevent to call multiple times a function in a delay.
 *
 * @param {*} delay in ms
 * @param {*} fn the callback
 * @param {*} deps array of dependancies
 */
export const useDebounce = (fn, delay, deps) => {
  const cb = React.useCallback(fn, deps)

  React.useEffect(() => {
    const id = setTimeout(() => cb(), delay)
    return () => clearTimeout(id)
  }, [cb, delay])
}
