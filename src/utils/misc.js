export const isEmpty = (obj) =>
  !obj ||
  (obj.constructor === Object && Object.keys(obj).length === 0) ||
  (obj.constructor === Array && obj.length === 0)

export const deleteProperty = (obj, property) => {
  const res = { ...obj }
  delete res[property]
  return res
}

export const capitalize = (str) => (!str?.length ? "" : str[0].toUpperCase() + str.slice(1))

export const pluralize = (count) => (count && count > 1 ? "s" : "")

export const fromEntries = (array) =>
  array.reduce((acc, curr) => {
    acc[curr[0]] = curr[1]
  }, {})

export const revertObject = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key]
    acc[value] = key
    return acc
  }, {})
}
