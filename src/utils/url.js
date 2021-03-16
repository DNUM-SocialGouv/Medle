/**
 * Build a URL with query params.
 *
 * @param {string} endpoint
 * @param {{}} params
 * @returns URL
 */
export function buildUrlWithParams(endpoint, params = {}) {
  const url = new URL(endpoint)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
  return url
}
